import os

from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth import get_user_model


class Command(BaseCommand):
    help = "Create or update the AgricWise admin user."

    def handle(self, *args, **options):
        email = os.environ.get("ADMIN_EMAIL")
        password = os.environ.get("ADMIN_PASSWORD")

        if not email or not password:
            raise CommandError(
                "ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required."
            )

        User = get_user_model()

        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                "first_name": "AgricWise",
                "last_name": "Admin",
            },
        )

        user.set_password(password)
        user.is_active = True
        user.is_staff = True
        user.is_superuser = True
        user.save()

        if created:
            self.stdout.write(
                self.style.SUCCESS(
                    f"Admin user {email} created successfully."
                )
            )
        else:
            self.stdout.write(
                self.style.SUCCESS(
                    f"Admin user {email} updated successfully."
                )
            )