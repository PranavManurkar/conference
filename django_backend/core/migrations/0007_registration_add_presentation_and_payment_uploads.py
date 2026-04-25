from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0006_merge_0005_registration_oral_presentation_and_more_0005_workshopregistration"),
    ]

    operations = [
        migrations.AddField(
            model_name="registration",
            name="cmt_id",
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name="registration",
            name="presentation_type",
            field=models.CharField(blank=True, choices=[("oral", "Oral"), ("poster", "Poster"), ("thesis", "Thesis")], max_length=20, null=True),
        ),
        migrations.AddField(
            model_name="registration",
            name="transaction_screenshot",
            field=models.ImageField(blank=True, null=True, upload_to="conference_transactions/"),
        ),
        migrations.AddField(
            model_name="workshopregistration",
            name="transaction_screenshot",
            field=models.ImageField(blank=True, null=True, upload_to="workshop_transactions/"),
        ),
    ]