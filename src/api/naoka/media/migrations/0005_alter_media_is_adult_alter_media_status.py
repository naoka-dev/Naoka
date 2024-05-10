# Generated by Django 5.0.4 on 2024-05-08 18:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("media", "0004_alter_media_options_remove_media_id_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="media",
            name="is_adult",
            field=models.BooleanField(null=True),
        ),
        migrations.AlterField(
            model_name="media",
            name="status",
            field=models.CharField(
                choices=[
                    ("auto", "Auto"),
                    ("not_started", "Not Started"),
                    ("ongoing", "Ongoing"),
                    ("finished", "Finished"),
                    ("hiatus", "Hiatus"),
                    ("cancelled", "Cancelled"),
                ],
                default="auto",
                max_length=11,
            ),
        ),
    ]
