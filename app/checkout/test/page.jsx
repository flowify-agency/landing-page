import { notFound } from "next/navigation";
import CheckoutTestPage from "../../test-checkout/page";

export const dynamic = "force-dynamic";

export default function CheckoutTestRoute(props) {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <CheckoutTestPage {...props} />;
}

