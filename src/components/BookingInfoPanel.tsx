interface InfoItemProps {
  label: string;
  value: string;
}

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div className="p-3 rounded-lg bg-gray-50/80 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-600/30">
      <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
        {label}
      </dt>
      <dd className="text-base font-medium text-gray-900 dark:text-white">
        {value}
      </dd>
    </div>
  );
}

interface BookingInfoPanelProps {
  title: string;
  items: { label: string; value: string }[];
}

export function BookingInfoPanel({ title, items }: BookingInfoPanelProps) {
  return (
    <section className="relative">
      <div className="rounded-2xl bg-white/70 backdrop-blur-md border border-gray-200/60 shadow-sm dark:bg-gray-800/70 dark:border-gray-600/40 overflow-hidden">
        <div className="p-6">
          <header className="mb-4">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              {title}
            </h2>
          </header>
          
          <dl className="space-y-3">
            {items.map((item, index) => (
              <InfoItem key={index} label={item.label} value={item.value} />
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
