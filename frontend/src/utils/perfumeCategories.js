export const DEFAULT_CATEGORY_ID = 1;

// Fuente única de categorías del catálogo.
// Para sumar una nueva categoría, agregá una fila con id, name y slug.
export const PERFUME_CATEGORY_DEFINITIONS = [
    { id: 1, name: "Masculinos", slug: "masculinos" },
    { id: 2, name: "Femeninos", slug: "femeninos" },
];

export const PERFUME_CATEGORY_NAMES = PERFUME_CATEGORY_DEFINITIONS.map((category) => category.name);

export const CATEGORY_ID_TO_NAME = Object.fromEntries(
    PERFUME_CATEGORY_DEFINITIONS.map((category) => [category.id, category.name])
);

export const CATEGORY_NAME_TO_ID = Object.fromEntries(
    PERFUME_CATEGORY_DEFINITIONS.map((category) => [category.name, category.id])
);

export const SLUG_TO_NAME = Object.fromEntries(
    PERFUME_CATEGORY_DEFINITIONS.map((category) => [category.slug, category.name])
);

export const SLUG_TO_ID = Object.fromEntries(
    PERFUME_CATEGORY_DEFINITIONS.map((category) => [category.slug, category.id])
);

export const NAME_TO_SLUG = Object.fromEntries(
    PERFUME_CATEGORY_DEFINITIONS.map((category) => [category.name, category.slug])
);

const normalizeCategoryLabel = (value = "") =>
    String(value || "")
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

const NORMALIZED_NAME_TO_ID = Object.fromEntries(
    PERFUME_CATEGORY_DEFINITIONS.map((category) => [normalizeCategoryLabel(category.name), category.id])
);

export const mapCategoryIdFromName = (value = "") => {
    const normalized = normalizeCategoryLabel(value);
    return NORMALIZED_NAME_TO_ID[normalized] || DEFAULT_CATEGORY_ID;
};

export const getNormalizedCategoryId = (product) => {
    const id = Number(product?.category_id);
    if (CATEGORY_ID_TO_NAME[id]) return id;

    const byName = mapCategoryIdFromName(product?.category_name);
    return byName || DEFAULT_CATEGORY_ID;
};

export const getDisplayCategoryName = (product) => {
    const normalizedId = getNormalizedCategoryId(product);
    return CATEGORY_ID_TO_NAME[normalizedId] || CATEGORY_ID_TO_NAME[DEFAULT_CATEGORY_ID];
};
