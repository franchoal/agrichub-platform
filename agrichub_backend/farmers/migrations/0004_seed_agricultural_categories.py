from django.db import migrations


CATEGORIES = [
    {
        "name": "Crop & Plant Farming",
        "slug": "crop-plant-farming",
        "description": (
            "Crop production, plant cultivation, horticulture, "
            "vegetable farming, fruit farming and related activities."
        ),
    },
    {
        "name": "Livestock & Poultry",
        "slug": "livestock-poultry",
        "description": (
            "Cattle, goats, sheep, pigs, poultry and other livestock "
            "production and related businesses."
        ),
    },
    {
        "name": "Fish Farming",
        "slug": "fish-farming",
        "description": (
            "Aquaculture, fish production, hatcheries and related "
            "aquaculture businesses."
        ),
    },
    {
        "name": "Agro-input Supplier",
        "slug": "agro-input-supplier",
        "description": (
            "Suppliers of seeds, fertilizers, crop protection products "
            "and other agricultural inputs."
        ),
    },
    {
        "name": "Agro-allied Products",
        "slug": "agro-allied-products",
        "description": (
            "Businesses producing or supplying agricultural and "
            "agro-allied products."
        ),
    },
    {
        "name": "Farm Equipment & Machinery",
        "slug": "farm-equipment-machinery",
        "description": (
            "Farm machinery, equipment, tools, implements and "
            "mechanization solutions."
        ),
    },
    {
        "name": "Irrigation & Greenhouse",
        "slug": "irrigation-greenhouse",
        "description": (
            "Irrigation systems, greenhouse solutions, water management "
            "and controlled-environment agriculture."
        ),
    },
    {
        "name": "Agricultural Services",
        "slug": "agricultural-services",
        "description": (
            "Farm management, veterinary services, soil services, "
            "mechanization, logistics and other agricultural services."
        ),
    },
    {
        "name": "Produce Buyer / Aggregator",
        "slug": "produce-buyer-aggregator",
        "description": (
            "Businesses and professionals that buy, aggregate and "
            "connect agricultural produce to markets."
        ),
    },
    {
        "name": "Agro-processing",
        "slug": "agro-processing",
        "description": (
            "Processing, packaging, preservation and value addition "
            "of agricultural produce."
        ),
    },
    {
        "name": "Agricultural Training & Consultancy",
        "slug": "agricultural-training-consultancy",
        "description": (
            "Agricultural education, training, extension, consulting "
            "and professional advisory services."
        ),
    },
    {
        "name": "Other Agricultural Business",
        "slug": "other-agricultural-business",
        "description": (
            "Other legitimate agricultural businesses or professional "
            "activities not covered by the listed categories."
        ),
    },
]


def seed_categories(apps, schema_editor):
    AgriculturalCategory = apps.get_model(
        "farmers",
        "AgriculturalCategory",
    )

    for category_data in CATEGORIES:
        AgriculturalCategory.objects.update_or_create(
            slug=category_data["slug"],
            defaults={
                "name": category_data["name"],
                "description": category_data["description"],
                "is_active": True,
            },
        )


def remove_categories(apps, schema_editor):
    AgriculturalCategory = apps.get_model(
        "farmers",
        "AgriculturalCategory",
    )

    slugs = [category["slug"] for category in CATEGORIES]

    AgriculturalCategory.objects.filter(
        slug__in=slugs
    ).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("farmers", "0003_agriculturalservice"),
    ]

    operations = [
        migrations.RunPython(
            seed_categories,
            remove_categories,
        ),
    ]