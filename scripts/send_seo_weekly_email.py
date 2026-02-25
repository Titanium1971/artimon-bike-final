#!/usr/bin/env python3
"""
Send weekly SEO action plan email.

Usage:
  python3 scripts/send_seo_weekly_email.py
  python3 scripts/send_seo_weekly_email.py --dry-run
  python3 scripts/send_seo_weekly_email.py --week 4
"""

from __future__ import annotations

import argparse
import datetime as dt
import os
import smtplib
from email.message import EmailMessage
from pathlib import Path
from typing import List, Tuple


PLAN_START_DATE = dt.date(2026, 2, 25)
DEFAULT_SUBJECT_PREFIX = "[Artimon Bike] Plan SEO hebdomadaire"


def _week_actions(week: int) -> Tuple[str, List[str]]:
    if week <= 1:
        return (
            "Semaine 1 - Fondations",
            [
                "Verifier sitemap, indexation, pages exclues, canonical, hreflang dans GSC.",
                "Verifier et completer Google Business Profile (categories, services, horaires, photos).",
                "Aligner NAP partout (nom, adresse, telephone).",
                "Mettre en place un tableau de bord KPI.",
            ],
        )
    if week == 2:
        return (
            "Semaine 2 - Quick wins techniques",
            [
                "Corriger erreurs d'indexation (404, soft 404, doublons).",
                "Renforcer maillage interne Home/Location/Blog vers pages locales.",
                "Ajouter schema LocalBusiness + Service sur pages locales.",
                "Verifier robots.txt et sitemap.xml.",
            ],
        )
    if week == 3:
        return (
            "Semaine 3 - Contenu local transactionnel",
            [
                "Publier page: location-velo-electrique-marseillan.",
                "Publier page: reparation-velo-marseillan.",
                "Ajouter FAQ locale (3 a 5 Q/R) sur pages ville.",
                "Ajouter preuves locales (photos, itineraires, points de repere).",
            ],
        )
    if week == 4:
        return (
            "Semaine 4 - Acceleration GBP",
            [
                "Lancer cadence avis: 5 a 7 demandes/semaine.",
                "Repondre a 100% des avis.",
                "Publier 1 post GBP cette semaine.",
                "Ajouter 10 a 15 photos geolocalisees.",
            ],
        )
    if week in (5, 6):
        return (
            f"Semaine {week} - Autorite locale",
            [
                "Obtenir 2 a 3 backlinks locaux de qualite cette semaine.",
                "Publier 1 contenu blog local a intention commerciale.",
                "Ajouter liens internes vers pages locales/services.",
            ],
        )
    if week in (7, 8):
        return (
            f"Semaine {week} - Extension geographique",
            [
                "Creer 1 nouvelle page locale sur une zone rentable.",
                "Creer 1 page saisonniere locale.",
                "Optimiser title/meta des pages qui ont CTR faible dans GSC.",
            ],
        )
    if week in (9, 10):
        return (
            f"Semaine {week} - Optimisation conversion",
            [
                "Renforcer CTA locaux (appel, WhatsApp, reserver).",
                "Tester une variation du hero local.",
                "Ajouter preuve sociale locale (avis, cas clients, photos).",
            ],
        )
    if week in (11, 12):
        return (
            f"Semaine {week} - Consolidation",
            [
                "Reaudit complet GSC + GBP.",
                "Fusionner/supprimer pages faibles.",
                "Definir plan trimestriel suivant.",
            ],
        )
    return (
        f"Semaine {week} - Rythme mensuel standard",
        [
            "Publier 1 contenu local cette semaine (objectif 4/mois).",
            "Publier 1 post GBP cette semaine (objectif 4/mois).",
            "Demander 2 a 3 avis cette semaine (objectif 8 a 12/mois).",
            "Chercher 1 backlink local de qualite cette semaine (objectif 3 a 5/mois).",
            "Executer mini sprint technique (indexation/perf/schema).",
        ],
    )


def _calc_week(today: dt.date) -> int:
    delta_days = (today - PLAN_START_DATE).days
    if delta_days < 0:
        return 1
    return (delta_days // 7) + 1


def _load_env_from_file(path: Path) -> None:
    if not path.exists():
        return
    for line in path.read_text(encoding="utf-8").splitlines():
        raw = line.strip()
        if not raw or raw.startswith("#") or "=" not in raw:
            continue
        key, value = raw.split("=", 1)
        key = key.strip()
        value = value.strip().strip("'").strip('"')
        if key and key not in os.environ:
            os.environ[key] = value


def _build_email_body(week_number: int, title: str, actions: List[str], plan_path: Path) -> str:
    lines = [
        "Bonjour Sebastien,",
        "",
        f"Voici le plan SEO a executer pour la semaine {week_number}.",
        f"Theme: {title}",
        "",
        "Actions prioritaires:",
    ]
    for i, action in enumerate(actions, start=1):
        lines.append(f"{i}. {action}")
    lines.extend(
        [
            "",
            "Rappels KPI a suivre cette semaine:",
            "- Clics, impressions, CTR, position (GSC)",
            "- Vues profil, appels, itineraire, clics site (GBP)",
            "- Conversions locales (appel/WhatsApp/reservation)",
            "",
            f"Reference complete du plan: {plan_path}",
            "",
            "Cordialement,",
            "Assistant SEO",
        ]
    )
    return "\n".join(lines)


def _required_env(var_name: str) -> str:
    value = os.getenv(var_name, "").strip()
    if not value:
        raise RuntimeError(f"Variable manquante: {var_name}")
    return value


def send_email(subject: str, body: str) -> None:
    smtp_host = _required_env("SEO_SMTP_HOST")
    smtp_port = int(os.getenv("SEO_SMTP_PORT", "587"))
    smtp_user = _required_env("SEO_SMTP_USER")
    smtp_password = _required_env("SEO_SMTP_PASSWORD")
    sender = os.getenv("SEO_MAIL_FROM", smtp_user).strip()
    recipient = _required_env("SEO_MAIL_TO")
    use_tls = os.getenv("SEO_SMTP_USE_TLS", "true").lower() in {"1", "true", "yes"}

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = sender
    msg["To"] = recipient
    msg.set_content(body)

    with smtplib.SMTP(smtp_host, smtp_port, timeout=30) as server:
        if use_tls:
            server.starttls()
        server.login(smtp_user, smtp_password)
        server.send_message(msg)


def main() -> int:
    parser = argparse.ArgumentParser(description="Send weekly SEO email")
    parser.add_argument("--dry-run", action="store_true", help="Print email instead of sending")
    parser.add_argument("--week", type=int, help="Force week number")
    args = parser.parse_args()

    repo_root = Path(__file__).resolve().parents[1]
    env_path = repo_root / ".env.seo-mail"
    _load_env_from_file(env_path)

    week_number = args.week if args.week and args.week > 0 else _calc_week(dt.date.today())
    title, actions = _week_actions(week_number)
    plan_path = repo_root / "docs" / "plan-seo-local-90j.md"

    subject_prefix = os.getenv("SEO_MAIL_SUBJECT_PREFIX", DEFAULT_SUBJECT_PREFIX)
    subject = f"{subject_prefix} - semaine {week_number}"
    body = _build_email_body(week_number, title, actions, plan_path)

    if args.dry_run:
        print("=== DRY RUN ===")
        print(f"Subject: {subject}")
        print(body)
        return 0

    send_email(subject, body)
    print(f"Email envoye pour la semaine {week_number}.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
