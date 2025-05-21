import { Clock, Shield, Award } from "lucide-react";
import ShaderLogo from "@/components/ShaderLogo";

// Импорт фото счастливого курьера
import manImage from "/images/man3.webp";
import manImageFallback from "/images/man3.png";

export default function Benefits() {
  // Дополнительные преимущества (компактная версия, без "Карьера")
  const additionalBenefits = [
    {
      icon: <Clock className="h-5 w-5 text-primary" />,
      title: "Гибкий график",
      description: "Работай когда удобно — утром, днем или вечером"
    },
    {
      icon: <Shield className="h-5 w-5 text-secondary" />,
      title: "Стабильно",
      description: "Выплаты 3 раза в неделю без задержек"
    },
    {
      icon: <Award className="h-5 w-5 text-primary" />,
      title: "Бонусы",
      description: "Дополнительные бонусы за выполненные заказы"
    }
  ];

  return (
    <section id="benefits" className="py-16">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="inline-block px-4 py-1.5 mb-4 rounded-full bg-primary/10 text-sm text-primary font-medium">
            Преимущества работы у нас
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Почему курьеры выбирают <span className="gradient-text inline-flex items-center gap-2">
              <ShaderLogo width="35px" height="35px" /> ЮНИК
            </span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Мы создаем технологичные и комфортные условия для наших курьеров
          </p>
        </div>

        {/* Основной блок преимуществ на полную ширину */}
        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Фото курьера */}
            <div className="md:w-1/3 relative">
              <div className="relative h-full overflow-hidden rounded-xl">
                <picture>
                  <source srcSet={manImage} type="image/webp" />
                  <img
                    src={manImageFallback}
                    alt="Курьер ЮНИК"
                    className="w-full h-full object-cover rounded-xl"
                    loading="lazy"
                  />
                </picture>
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 via-transparent to-transparent opacity-80"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-2xl font-bold text-white mb-2">Стань курьером ЮНИК</h3>
                  <p className="text-white/90">Начни зарабатывать уже сегодня</p>
                </div>
              </div>
            </div>

            {/* Основные преимущества - на 2/3 ширины */}
            <div className="md:w-2/3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
                {additionalBenefits.map((benefit, index) => (
                  <div key={index} className="relative p-4 rounded-xl bg-white shadow border border-primary/10 h-full">
                    <div className="relative z-10">
                      <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                        {benefit.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-2 tracking-tight">{benefit.title}</h3>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </div>
                    <div className="absolute -z-10 inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-secondary/5 rounded-xl blur-sm"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
