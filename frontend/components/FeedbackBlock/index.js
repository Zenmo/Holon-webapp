import Sentiment from "./Sentiment";
import SubscriptionForm from "./SubscriptionForm";

export default function FeedbackBlock() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-holon-blue-900 text-gray-100">
      <div className="flex flex-wrap md:max-w-[48rem]">
        <Sentiment />
        <h1 className="w-full pb-6 text-center text-5xl font-semibold">
          Schrijf je in voor updates
        </h1>
        <SubscriptionForm />
      </div>
    </main>
  );
}
