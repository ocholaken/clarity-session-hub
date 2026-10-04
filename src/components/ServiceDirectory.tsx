import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { serviceCatalog, type CatalogService, type ServiceCategory } from "@/lib/service-catalog";

type ServiceFilter = "all" | ServiceCategory;

const filters: { value: ServiceFilter; label: string }[] = [
  { value: "all", label: "All services" },
  { value: "clinical", label: "Counseling & therapy" },
  { value: "schools", label: "Schools & institutions" },
];

const ServiceDirectory = ({ onBook }: { onBook: (service: CatalogService) => void }) => {
  const [filter, setFilter] = useState<ServiceFilter>("all");
  const visibleServices = useMemo(
    () => serviceCatalog.filter((service) => filter === "all" || service.category === filter),
    [filter],
  );

  return (
    <div>
      <div
        aria-label="Filter services"
        className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-2 scrollbar-hide sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
      >
        {filters.map((item) => (
          <button
            key={item.value}
            type="button"
            aria-pressed={filter === item.value}
            onClick={() => setFilter(item.value)}
            className={`shrink-0 rounded-full border px-4 py-2.5 text-sm font-medium transition ${
              filter === item.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground hover:border-primary/50"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 sm:px-0 lg:grid-cols-3">
        {visibleServices.map((service) => {
          const Icon = service.icon;

          return (
            <Card
              key={service.id}
              className="flex w-full flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
            >
              <CardHeader className="p-0">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent">
                    <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  {service.badge && (
                    <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-accent-foreground">
                      {service.badge}
                    </span>
                  )}
                </div>
                <CardTitle className="text-xl leading-snug">{service.name}</CardTitle>
                {service.audience && (
                  <p className="text-xs font-medium text-primary">{service.audience}</p>
                )}
              </CardHeader>
              <CardContent className="flex flex-1 flex-col p-0 pt-3">
                <CardDescription className="flex-1 text-sm leading-6">
                  {service.description}
                </CardDescription>
                <div className="mt-5 space-y-1">
                  <p className="text-sm font-semibold text-primary">{service.price_label}</p>
                  <p className="text-xs text-muted-foreground">{service.duration_label}</p>
                </div>
                <Button
                  type="button"
                  onClick={() => onBook(service)}
                  className="mt-5 w-full py-3 transition-transform active:scale-95"
                >
                  Book Now
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ServiceDirectory;
