// State pages render the full service page layout (same as the main Construction /
// Agricultural / Industrial / Truck pages) with state-specific copy, breadcrumbs,
// flag watermark, and SEO injected by CategoryPage when a stateSlug param is present.
import CategoryPage from "./Category";

const CategoryStatePage = () => <CategoryPage />;

export default CategoryStatePage;
