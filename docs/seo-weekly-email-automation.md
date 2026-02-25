# Automatisation email SEO hebdomadaire (lundi matin)

Ce guide envoie automatiquement au client le plan SEO de la semaine.

## Fichiers

- Script: `scripts/send_seo_weekly_email.py`
- Plan SEO: `docs/plan-seo-local-90j.md`
- Exemple config: `.env.seo-mail.example`

## 1) Configurer les identifiants SMTP

Depuis le repo:

```bash
cd "/Users/cyril/Desktop/Artimon Bike/artimon-bike-final-main"
cp .env.seo-mail.example .env.seo-mail
```

Puis editer `.env.seo-mail` avec les vraies valeurs:

- `SEO_SMTP_USER`: adresse expediteur
- `SEO_SMTP_PASSWORD`: mot de passe SMTP (Gmail: App Password)
- `SEO_MAIL_FROM`: expediteur affiche
- `SEO_MAIL_TO`: `sebarilla@gmail.com`

## 2) Tester en mode simulation

```bash
cd "/Users/cyril/Desktop/Artimon Bike/artimon-bike-final-main"
python3 scripts/send_seo_weekly_email.py --dry-run
```

## 3) Tester un envoi reel

```bash
cd "/Users/cyril/Desktop/Artimon Bike/artimon-bike-final-main"
python3 scripts/send_seo_weekly_email.py
```

## 4) Planifier chaque lundi a 08:30 (cron macOS)

Ouvrir le crontab:

```bash
crontab -e
```

Ajouter cette ligne:

```cron
30 8 * * 1 cd "/Users/cyril/Desktop/Artimon Bike/artimon-bike-final-main" && /usr/bin/python3 scripts/send_seo_weekly_email.py >> /tmp/seo-weekly-mail.log 2>&1
```

Verifier la tache:

```bash
crontab -l
```

## 5) Logs

Log d'execution:

`/tmp/seo-weekly-mail.log`

## 6) Notes

- Le script calcule automatiquement la semaine du plan (depart: 25/02/2026).
- Apres semaine 12, il passe en mode "rythme mensuel standard".
- Forcer une semaine manuellement:

```bash
python3 scripts/send_seo_weekly_email.py --week 4 --dry-run
```
