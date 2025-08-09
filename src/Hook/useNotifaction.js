import { toast } from "sonner";

const notify = (message, type) => {
    toast[type === "error" ? "error" : "success"](
        type === "error" ? "خطأ" : "نجاح",
        {
            description: message,
            duration: 4000,
            style: {
                background: type === "error" ? "#fee2e2" : "#f0fdf4",
                border: `1px solid ${type === "error" ? "#fecaca" : "#bbf7d0"}`,
                color: type === "error" ? "#dc2626" : "#16a34a",
                fontFamily: "Cairo",
                direction: "rtl"
            }
        }
    );
};

export default notify; 