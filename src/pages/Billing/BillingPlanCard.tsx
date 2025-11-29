import { CheckIcon } from "./BillingIcons";
import { Plan } from "./BillingType";

const PlanCard: React.FC<{ plan: Plan }> = ({ plan }) => {
  const isCurrent = plan.isCurrent;
  const cardClasses = isCurrent
    ? "border-2 border-teal-500 shadow-2xl shadow-teal-100/50"
    : "border border-gray-200 hover:shadow-lg transition-shadow";

  const buttonClasses = isCurrent
    ? "bg-gray-200 text-gray-700 cursor-default shadow-none"
    : "bg-teal-500 text-white hover:bg-teal-600 transition-colors shadow-lg shadow-teal-500/20";

  return (
    <div
      className={`p-6 rounded-2xl flex flex-col h-full bg-white ${cardClasses}`}
    >
      {plan.isPopular && (
        <div className="text-xs font-semibold text-teal-700 bg-teal-100 px-3 py-1 rounded-full w-fit mb-4 self-start">
          Current Plan
        </div>
      )}
      <h3 className="text-xl font-bold text-gray-800 mb-1">{plan.name}</h3>
      <p className="text-sm text-gray-500 mb-6">{plan.tagline}</p>

      <div className="flex items-baseline mb-6">
        <span className="text-4xl font-extrabold text-gray-900">
          ${plan.price}
        </span>
        <span className="text-base font-medium text-gray-500">
          {plan.period}
        </span>
      </div>

      <div className="space-y-3 flex-grow">
        {plan.features.map((feature, index) => (
          <div key={index} className="flex items-start text-sm text-gray-700">
            <CheckIcon />
            <span>{feature}</span>
          </div>
        ))}
      </div>

      <button
        className={`mt-6 w-full py-3 rounded-xl font-semibold text-base ${buttonClasses} transition-all duration-300`}
        disabled={isCurrent}
        onClick={() =>
          !isCurrent && console.log(`${plan.buttonText} ${plan.name}`)
        }
      >
        {plan.buttonText}
      </button>
    </div>
  );
};

export default PlanCard;