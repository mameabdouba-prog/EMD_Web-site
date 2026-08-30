"""
Service Web Push pour les notifications du site EMD.
Envoie des notifications push aux navigateurs abonnés (via pywebpush + VAPID).
"""

import json
import logging

from django.conf import settings
from django.contrib.auth import get_user_model

logger = logging.getLogger(__name__)


def _vapid_ready():
    """Retourne True si les clés VAPID sont configurées (prod)."""
    return bool(settings.VAPID_PUBLIC_KEY and settings.VAPID_PRIVATE_KEY)


def send_to_subscriptions(title, body, url=None, badge=None, data=None, icon=None):
    """
    Envoie une notification push à tous les navigateurs abonnés.
    Les abonnements expirés (410 Gone / 404) sont supprimés automatiquement.
    Retourne le nombre d'envois réussis.
    """
    if not _vapid_ready():
        logger.warning("VAPID non configuré - notification push ignorée")
        return 0

    from .models import PushSubscription

    try:
        from pywebpush import webpush, WebPushException
    except ImportError:
        logger.error("pywebpush n'est pas installé")
        return 0

    subs = PushSubscription.objects.all()
    if not subs.exists():
        return 0

    payload = {
        "title": title,
        "body": body,
    }
    if url:
        payload["url"] = url
    if badge:
        payload["badge"] = badge
    if icon:
        payload["icon"] = icon
    if data:
        payload["data"] = data

    # L'endpoint contact@gs-emd.com est utilisé comme identité VAPID (sub)
    if not settings.VAPID_ADMIN_EMAIL:
        logger.warning("VAPID_ADMIN_EMAIL non configuré - notification push ignorée")
        return 0

    claims = {
        "sub": f"mailto:{settings.VAPID_ADMIN_EMAIL}",
    }

    success = 0
    for sub in subs:
        info = {
            "endpoint": sub.endpoint,
            "keys": {
                "p256dh": sub.p256dh,
                "auth": sub.auth,
            },
        }
        try:
            webpush(
                subscription_info=info,
                data=json.dumps(payload),
                vapid_private_key=settings.VAPID_PRIVATE_KEY,
                vapid_claims=claims,
                ttl=120,
            )
            if sub.last_error:
                sub.last_error = ""
                sub.save(update_fields=["last_error"])
            success += 1
        except WebPushException as exc:
            status_code = getattr(exc.response, "status_code", None)
            # 410 Gone / 404 Not Found = l'abonnement a expiré → suppression
            if status_code in (404, 410):
                logger.info(f"Abonnement push expiré, suppression : {status_code}")
                sub.delete()
            else:
                logger.warning(
                    f"Erreur envoi push ({status_code}) : {str(exc)}"
                )
                sub.last_error = str(exc)[:255]
                sub.save(update_fields=["last_error"])
        except Exception as exc:
            logger.error(f"Erreur push inattendue : {str(exc)}")

    return success
