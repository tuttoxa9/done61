import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/range";
import { Calendar, Clock, ArrowUpRight, PiggyBank, Wallet, BarChart, Car } from "lucide-react";

export default function IncomeCalculator() {
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

  return (
    <section id="calculator" className="py-12 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-40 h-40 bg-secondary/10 rounded-full filter blur-[60px]"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-primary/10 rounded-full filter blur-[70px]"></div>
      </div>

      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="inline-block px-3 py-1 mb-3 rounded-full bg-primary/10 text-sm text-primary font-medium">
            Калькулятор заработка
          </span>
          <h2 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight">
            Узнай свой <span className="gradient-text">доход</span>
          </h2>
          <p className="text-base text-muted-foreground">
            Рассчитай, сколько ты сможешь заработать в качестве курьера
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <div className="absolute -z-10 inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-xl blur-md"></div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-primary/10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5 relative">
                <div className="space-y-5">
                  <div>
                    <h3 className="font-bold text-base mb-3 flex items-center font-heading">
                      <Clock className="text-primary h-4 w-4 mr-1" />
                      Настрой свой график
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <label className="text-sm font-medium">Часов в день</label>
                          <span className="flex items-center gap-1 bg-primary/10 rounded-full px-2 py-0.5 text-xs font-medium">
                            <Clock className="h-3 w-3 text-primary" /> {hours} ч
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium">4ч</span>
                          <Slider
                            value={[hours]}
                            min={4}
                            max={12}
                            step={1}
                            onValueChange={(value) => setHours(value[0])}
                            className="flex-1"
                          />
                          <span className="text-xs font-medium">12ч</span>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <label className="text-sm font-medium">Дней в неделю</label>
                          <span className="flex items-center gap-1 bg-primary/10 rounded-full px-2 py-0.5 text-xs font-medium">
                            <Calendar className="h-3 w-3 text-primary" /> {days} д
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium">2д</span>
                          <Slider
                            value={[days]}
                            min={2}
                            max={7}
                            step={1}
                            onValueChange={(value) => setDays(value[0])}
                            className="flex-1"
                          />
                          <span className="text-xs font-medium">7д</span>
                        </div>
                      </div>

                      <div className="pt-1">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-medium flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={useVehicle}
                              onChange={(e) => setUseVehicle(e.target.checked)}
                              className="rounded text-primary w-3 h-3"
                            />
                            <span className="flex items-center gap-1">
                              <Car className="h-3 w-3 text-muted-foreground" />
                              На авто/мото
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-secondary/10 shadow-sm">
                    <div className="flex items-start gap-2">
                      <PiggyBank className="h-4 w-4 text-secondary mt-0.5" />
                      <div>
                        <h4 className="font-medium text-xs">Регулярные выплаты</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Получай деньги 3 раза в неделю
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-7">
                <h3 className="font-bold text-base mb-3 flex items-center font-heading">
                  <Wallet className="text-primary h-4 w-4 mr-1" />
                  Твой потенциальный доход
                </h3>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="glass-card rounded-lg p-3 hover:shadow-sm transition-all duration-300">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="text-xs font-medium text-muted-foreground">В день</h4>
                      <span className="text-xs bg-primary/10 text-primary rounded-full px-1.5 py-0.5">{hours}ч</span>
                    </div>
                    <div className="font-heading font-bold text-xl gradient-text">
                      {formatCurrency(income.daily)} р
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <div className="text-xs text-muted-foreground">{hours}ч × {getHourlyRate()} р</div>
                      <ArrowUpRight className="h-3 w-3 text-primary" />
                    </div>
                  </div>

                  <div className="glass-card rounded-lg p-3 hover:shadow-sm transition-all duration-300">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="text-xs font-medium text-muted-foreground">В неделю</h4>
                      <span className="text-xs bg-primary/10 text-primary rounded-full px-1.5 py-0.5">{days}д</span>
                    </div>
                    <div className="font-heading font-bold text-xl gradient-text">
                      {formatCurrency(income.weekly)} р
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <div className="text-xs text-muted-foreground">{formatCurrency(income.daily)} р × {days}д</div>
                      <ArrowUpRight className="h-3 w-3 text-primary" />
                    </div>
                  </div>

                  <div className="glass-card rounded-lg p-3 hover:shadow-sm transition-all duration-300">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="text-xs font-medium text-muted-foreground">В месяц</h4>
                      <span className="text-xs bg-secondary/10 text-secondary rounded-full px-1.5 py-0.5">4 нед</span>
                    </div>
                    <div className="font-heading font-bold text-xl gradient-text">
                      {formatCurrency(income.monthly)} р
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <div className="text-xs text-muted-foreground">{formatCurrency(income.weekly)} р × 4</div>
                      <ArrowUpRight className="h-3 w-3 text-secondary" />
                    </div>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground mb-3">
                  * Приблизительный расчет. Фактический доход может отличаться в зависимости от района работы и количества заказов.
                </div>

                <div className="text-center">
                  <a href="#apply">
                    <Button size="default" className="primary-gradient text-white px-4 py-2 text-sm font-medium">
                      Начать зарабатывать
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
