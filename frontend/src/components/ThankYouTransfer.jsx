import { useEffect, useContext } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Context } from "../js/store/appContext.jsx";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function ThankYouTransfer() {
    const { store, actions } = useContext(Context);
    const q = useQuery();
    const navigate = useNavigate();

    const status = q.get("status");
    const orderId = q.get("order_id");
    const token = q.get("token");

    // 🔹 Cargar productos
    useEffect(() => {
        const init = async () => {

            await actions.fetchProducts?.();
        };
        init();
    }, []);

    useEffect(() => {
        const handlePaymentSuccess = async () => {
            if (status !== "approved") return;

            // 🛒 Limpiar carrito
            await actions.resetCartAfterPayment?.();
            await new Promise(r => setTimeout(r, 200));

            // 🔐 Auto-login si tenemos token
            if (!store.user && token) {
                try {
                    localStorage.setItem("token", token);
                    localStorage.setItem("needs_password_reset", "true");
                    await actions.hydrateSession?.();
                } catch (err) {
                    console.error("❌ Error en auto-login transferencia:", err);
                }
            }

            // 🔄 Actualizar órdenes después del login
            await actions.fetchOrders?.();
        };

        handlePaymentSuccess();
    }, [status, token]);

    const lastOrder = store.orders?.[0]; // la última orden registrada
    const publicNum = lastOrder?.public_order_number || orderId;

    return (
        <div className="max-w-2xl mx-auto px-4 py-14 text-center">
            {status === "approved" ? (
                <>
                    <div className="text-5xl mb-4">💸</div>
                    <h1 className="text-3xl font-bold mb-2">¡Pedido confirmado!</h1>
                    <p className="text-gray-600 mb-6">
                        Tu pedido #{publicNum} fue registrado y está pendiente de pago por transferencia hasta que nos envíes el comprobante.
                    </p>

                    <div className="bg-white border rounded-xl p-5 text-left mb-8">
                        <h2 className="font-semibold mb-2">Próximos pasos</h2>
                        <p className="text-sm text-gray-700">
                            Envíanos tu comprobante para confirmar el pago:
                        </p>
                        <ul className="mt-3 text-sm space-y-1">
                            <li><strong>Banco:</strong> Banco Nación</li>
                            <li><strong>CBU:</strong> 0112345678901234567890</li>
                            <li><strong>Alias:</strong> alias.pendiente</li>
                            <li><strong>Titular:</strong> Mauricio Fiuri</li>
                        </ul>

                        <div className="mt-4 flex flex-col sm:flex-row gap-3">
                            <a
                                href={`mailto:ventas@example.com?subject=Comprobante%20pedido%20${publicNum}&body=Hola,%20adjunto%20mi%20comprobante%20de%20transferencia.`}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                            >
                                📧 Enviar por mail
                            </a>
                            <a
                                href={`https://wa.me/5493533497041?text=Hola!%20Te%20env%C3%ADo%20el%20comprobante%20de%20mi%20pedido%20#${publicNum}`}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                💬 Enviar por WhatsApp
                            </a>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            to="/cuenta"
                            className="px-5 py-3 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
                        >
                            Ver mis pedidos
                        </Link>
                        <button
                            onClick={() => navigate("/inicio")}
                            className="px-5 py-3 rounded-lg border border-gray-300 hover:bg-gray-50"
                        >
                            Seguir comprando
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <div className="text-5xl mb-4">⏳</div>
                    <h1 className="text-3xl font-bold mb-2">Pedido pendiente</h1>
                    <p className="text-gray-600 mb-6">
                        Esperando confirmación del pago de la transferencia.
                    </p>
                    <button
                        onClick={() => navigate("/inicio")}
                        className="px-5 py-3 rounded-lg bg-gray-900 text-white hover:bg-gray-800"
                    >
                        Volver a la tienda
                    </button>
                </>
            )}
        </div>
    );
}
