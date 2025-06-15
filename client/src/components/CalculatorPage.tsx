import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/range";
import { Calendar, Clock, ArrowUpRight, PiggyBank, Wallet, Car, ChevronLeft } from "lucide-react";
import useMobile from "@/hooks/use-mobile";
import { useLocation } from "wouter";

export default function CalculatorPage() {
  const isMobile = useMobile();
  const [, setLocation] = useLocation();
  const [hours, setHours] = useState<number>(8);
  const [days, setDays] = useState<number>(5);
  const [useVehicle, setUseVehicle] = useState<boolean>(false);
  const [income, setIncome] = useState({
    daily: 0,
    weekly: 0,
    monthly: 0,
  });

  // Base hourly rate in BYN depending on transportation mode
  const getHourlyRate = () => useVehicle ? 15 : 12;

  useEffect(() => {
    const hourlyRate = getHourlyRate();
    const daily = hours * hourlyRate;
    const weekly = daily * days;
    const monthly = weekly * 4; // Assuming 4 weeks in a month

    setIncome({
      daily,
      weekly,
      monthly,
    });
  }, [hours, days, useVehicle]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU').format(amount);
  };

  const handleBack = () => {
    setLocation("/");
  };

  return (
    <div className="container-custom py-10">
      <div className="max-w-5xl mx-auto">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-6 flex items-center text-primary hover:text-primary/90"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Вернуться на главную
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-4xl font-bold mb-3 tracking-tight">
            Калькулятор <span className="gradient-text">дохода</span> курьера
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Рассчитай, сколько ты сможешь заработать в качестве курьера
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-primary/10 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
            <div className="md:col-span-5 relative">
              <div className="space-y-4 md:space-y-6">
                <div>
                  <h3 className="font-bold text-base md:text-lg mb-3 md:mb-4 flex items-center font-heading">
                    <Clock className="text-primary h-4 w-4 md:h-5 md:w-5 mr-2" />
                    Настрой свой график
                  </h3>

                  <div className="space-y-4 md:space-y-5">
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm md:text-base font-medium">Часов в день</label>
                        <span className="flex items-center gap-1 bg-primary/10 rounded-full px-3 py-1 text-sm font-medium">
                          <Clock className="h-3 w-3 text-primary" /> {hours} ч
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs md:text-sm font-medium">4ч</span>
                        <Slider
                          value={[hours]}
                          min={4}
                          max={12}
                          step={1}
                          onValueChange={(value) => setHours(value[0])}
                          className="flex-1"
                        />
                        <span className="text-xs md:text-sm font-medium">12ч</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm md:text-base font-medium">Дней в неделю</label>
                        <span className="flex items-center gap-1 bg-primary/10 rounded-full px-3 py-1 text-sm font-medium">
                          <Calendar className="h-3 w-3 text-primary" /> {days} д
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs md:text-sm font-medium">2д</span>
                        <Slider
                          value={[days]}
                          min={2}
                          max={7}
                          step={1}
                          onValueChange={(value) => setDays(value[0])}
                          className="flex-1"
                        />
                        <span className="text-xs md:text-sm font-medium">7д</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm md:text-base font-medium flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={useVehicle}
                            onChange={(e) => setUseVehicle(e.target.checked)}
                            className="rounded text-primary w-4 h-4"
                          />
                          <span className="flex items-center gap-1">
                            <Car className="h-4 w-4 text-muted-foreground" />
                            На авто/мото
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 md:p-4 rounded-lg bg-secondary/10 shadow-sm">
                  <div className="flex items-start gap-2">
                    <PiggyBank className="h-4 w-4 md:h-5 md:w-5 text-secondary mt-1" />
                    <div>
                      <h4 className="font-medium text-sm md:text-base">Регулярные выплаты</h4>
                      <p className="text-xs md:text-sm text-muted-foreground mt-1">
                        Получай деньги 3 раза в неделю
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-7">
              <h3 className="font-bold text-base md:text-lg mb-3 md:mb-4 flex items-center font-heading">
                <Wallet className="text-primary h-4 w-4 md:h-5 md:w-5 mr-2" />
                Твой потенциальный доход
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-4">
                <div className="glass-card rounded-lg p-3 md:p-4 hover:shadow-sm transition-all duration-300">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium text-muted-foreground">В день</h4>
                    <span className="text-xs bg-primary/10 text-primary rounded-full px-2 py-1">{hours}ч</span>
                  </div>
                  <div className="font-heading font-bold text-xl md:text-2xl gradient-text">
                    {formatCurrency(income.daily)} р
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-xs md:text-sm text-muted-foreground">{hours}ч × {getHourlyRate()} р</div>
                    <ArrowUpRight className="h-4 w-4 text-primary" />
                  </div>
                </div>

                <div className="glass-card rounded-lg p-3 md:p-4 hover:shadow-sm transition-all duration-300">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium text-muted-foreground">В неделю</h4>
                    <span className="text-xs bg-primary/10 text-primary rounded-full px-2 py-1">{days}д</span>
                  </div>
                  <div className="font-heading font-bold text-xl md:text-2xl gradient-text">
                    {formatCurrency(income.weekly)} р
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-xs md:text-sm text-muted-foreground">{formatCurrency(income.daily)} р × {days}д</div>
                    <ArrowUpRight className="h-4 w-4 text-primary" />
                  </div>
                </div>

                <div className="glass-card rounded-lg p-3 md:p-4 hover:shadow-sm transition-all duration-300">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium text-muted-foreground">В месяц</h4>
                    <span className="text-xs bg-secondary/10 text-secondary rounded-full px-2 py-1">4 нед</span>
                  </div>
                  <div className="font-heading font-bold text-xl md:text-2xl gradient-text">
                    {formatCurrency(income.monthly)} р
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-xs md:text-sm text-muted-foreground">{formatCurrency(income.weekly)} р × 4</div>
                    <ArrowUpRight className="h-4 w-4 text-secondary" />
                  </div>
                </div>
              </div>

              <div className="text-sm text-muted-foreground mt-4 mb-6 bg-secondary/5 p-3 rounded-lg">
                * Приблизительный расчет. Фактический доход может отличаться в зависимости от района работы и количества заказов.
              </div>

              <div className="text-center">
                <Button
                  size="lg"
                  className="primary-gradient text-white px-6 py-3 text-base font-medium"
                  onClick={handleBack}
                >
                  Вернуться на главную
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
