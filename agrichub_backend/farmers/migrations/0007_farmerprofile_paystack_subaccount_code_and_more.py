
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("farmers", "0006_farmerprofile_is_published_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="farmerprofile",
            name="paystack_subaccount_code",
            field=models.CharField(
                max_length=100,
                blank=True,
                default="",
                help_text=(
                    "Private Paystack subaccount code for seller settlements. "
                    "Enter only after the subaccount has been verified. "
                    "Do not enter a bank account number."
                ),
            ),
        ),
        migrations.AlterField(
            model_name="agriculturalservice",
            name="image",
            field=models.ImageField(
                blank=True,
                null=True,
                upload_to="",
            ),
        ),
    ]
