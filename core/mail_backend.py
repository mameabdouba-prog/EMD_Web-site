import ssl

from django.core.mail.backends.smtp import EmailBackend


class InsecureSMTPSSLEmailBackend(EmailBackend):
    """Backend SMTP-SSL qui désactive la vérification du certificat du serveur
    (le certificat de mail.gs-emd.com ne couvre pas ce hostname)."""

    @property
    def ssl_context(self):
        context = ssl.create_default_context()
        context.check_hostname = False
        context.verify_mode = ssl.CERT_NONE
        return context
