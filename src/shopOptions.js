// Options for the shop filters and the add-item form.
// Edit these lists to change what staff can pick and shoppers can filter by.

export const CLOTHING_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One size'];
export const SHOE_SIZES = ['5', '6', '7', '8', '9', '10', '11', '12', '13'].map((s) => `US ${s}`);

// `sizes` decides which size list (if any) appears for that category.
export const CATEGORIES = [
  { name: 'Tops', sizes: 'clothing' },
  { name: 'Bottoms', sizes: 'clothing' },
  { name: 'Dresses & skirts', sizes: 'clothing' },
  { name: 'Outerwear', sizes: 'clothing' },
  { name: 'Shoes', sizes: 'shoes' },
  { name: 'Accessories', sizes: null },
  { name: 'Dorm & home', sizes: null },
  { name: 'Kitchen', sizes: null },
  { name: 'Books', sizes: null },
  { name: 'Other', sizes: null },
];

export function sizesForCategory(categoryName) {
  const cat = CATEGORIES.find((c) => c.name === categoryName);
  if (!cat || !cat.sizes) return [];
  return cat.sizes === 'shoes' ? SHOE_SIZES : CLOTHING_SIZES;
}

export const CONDITIONS = ['Like new', 'Gently used', 'Well loved'];

export const COLORS = [
  { name: 'Black', hex: '#1a1a1a' },
  { name: 'White', hex: '#ffffff' },
  { name: 'Grey', hex: '#9aa0a6' },
  { name: 'Navy', hex: '#1f2a5a' },
  { name: 'Blue', hex: '#3a7bd5' },
  { name: 'Green', hex: '#3c8d4f' },
  { name: 'Red', hex: '#c8352e' },
  { name: 'Pink', hex: '#ec8fb5' },
  { name: 'Purple', hex: '#7b4fb0' },
  { name: 'Yellow', hex: '#f5c518' },
  { name: 'Orange', hex: '#e8792b' },
  { name: 'Brown', hex: '#7a5230' },
  { name: 'Beige', hex: '#d9c7a7' },
  { name: 'Multicolor', hex: 'conic-gradient(#c8352e, #f5c518, #3c8d4f, #3a7bd5, #7b4fb0, #c8352e)' },
];

export function colorSwatch(name) {
  return COLORS.find((c) => c.name === name)?.hex ?? '#cccccc';
}
