import ProductGridNuevo from "../components/ui/product/ProductGridNuevo";

export default function Mayorista() {
    return (
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6">

            {/* título opcional */}
            <h1 className="font-serif text-2xl font-bold mb-6 text-center">
                Catálogo Mayorista
            </h1>

            {/* catálogo completo */}
            <ProductGridNuevo hideFilters={false} />

        </div>
    );
}
