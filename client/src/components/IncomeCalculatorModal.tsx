import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/range";
import { Calendar, Clock, ArrowUpRight, PiggyBank, Wallet, Car, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import useMobile from "@/hooks/use-mobile";

interface IncomeCalculatorModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export default function IncomeCalculatorModal({
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
  className = ""
}: IncomeCalculatorModalProps) {
  const isMobile = useMobile();
  const [internalOpen, setInternalOpen] = useState<boolean>(false);
  const [hours, setHours] = useState<number>(8);
  const [days, setDays] = useState<number>(5);
  const [useVehicle, setUseVehicle] = useState<boolean>(false);
  const [income, setIncome] = useState({
    daily: 0,
    weekly: 0,
    monthly: 0,
  });

  // Use either external or internal state management
  const open = externalOpen !== undefined ? externalOpen : internalOpen;

  // Функция для обработки изменения состояния модального окна
  const handleOpenChange = (value: boolean) => {
    if (externalOnOpenChange) {
      externalOnOpenChange(value);
    } else {
      setInternalOpen(value);
    }
  };

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

  // Предотвращаем закрытие при клике за пределами модального окна
  const handleOutsideClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={`sm:max-w-4xl max-h-[90vh] overflow-y-auto ${isMobile ? 'p-3' : 'p-6'} ${className}`}
        onPointerDownOutside={handleOutsideClick}
      >
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl md:text-3xl font-bold mb-2 md:mb-3 tracking-tight">
            Калькулятор <span className="gradient-text">дохода</span> курьера
          </DialogTitle>
          <p className="text-sm md:text-base text-muted-foreground">
            Рассчитай, сколько ты сможешь заработать в качестве курьера
          </p>
        </DialogHeader>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-primary/10 relative">
          <DialogClose className="absolute top-2 right-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-2 md:mt-4">
            <div className="md:col-span-5 relative">
              <div className="space-y-3 md:space-y-5">
                <div>
                  <h3 className="font-bold text-sm md:text-base mb-2 md:mb-3 flex items-center font-heading">
                    <Clock className="text-primary h-3 w-3 md:h-4 md:w-4 mr-1" />
                    Настрой свой график
                  </h3>

                  <div className="space-y-3 md:space-y-4">
                    <div>
                      <div className="flex justify-between mb-1 md:mb-2">
                        <label className="text-xs md:text-sm font-medium">Часов в день</label>
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
                      <div className="flex justify-between mb-1 md:mb-2">
                        <label className="text-xs md:text-sm font-medium">Дней в неделю</label>
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
                        <label className="text-xs md:text-sm font-medium flex items-center gap-2">
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

                <div className="p-2 md:p-3 rounded-lg bg-secondary/10 shadow-sm">
                  <div className="flex items-start gap-2">
                    <PiggyBank className="h-3 w-3 md:h-4 md:w-4 text-secondary mt-0.5" />
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
              <h3 className="font-bold text-sm md:text-base mb-2 md:mb-3 flex items-center font-heading">
                <Wallet className="text-primary h-3 w-3 md:h-4 md:w-4 mr-1" />
                Твой потенциальный доход
              </h3>

              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="glass-card rounded-lg p-2 md:p-3 hover:shadow-sm transition-all duration-300">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-xs font-medium text-muted-foreground">В день</h4>
                    <span className="text-xs bg-primary/10 text-primary rounded-full px-1.5 py-0.5">{hours}ч</span>
                  </div>
                  <div className="font-heading font-bold text-lg md:text-xl gradient-text">
                    {formatCurrency(income.daily)} р
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <div className="text-xs text-muted-foreground">{hours}ч × {getHourlyRate()} р</div>
                    <ArrowUpRight className="h-3 w-3 text-primary" />
                  </div>
                </div>

                <div className="glass-card rounded-lg p-2 md:p-3 hover:shadow-sm transition-all duration-300">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-xs font-medium text-muted-foreground">В неделю</h4>
                    <span className="text-xs bg-primary/10 text-primary rounded-full px-1.5 py-0.5">{days}д</span>
                  </div>
                  <div className="font-heading font-bold text-lg md:text-xl gradient-text">
                    {formatCurrency(income.weekly)} р
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <div className="text-xs text-muted-foreground">{formatCurrency(income.daily)} р × {days}д</div>
                    <ArrowUpRight className="h-3 w-3 text-primary" />
                  </div>
                </div>

                <div className="glass-card rounded-lg p-2 md:p-3 hover:shadow-sm transition-all duration-300">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-xs font-medium text-muted-foreground">В месяц</h4>
                    <span className="text-xs bg-secondary/10 text-secondary rounded-full px-1.5 py-0.5">4 нед</span>
                  </div>
                  <div className="font-heading font-bold text-lg md:text-xl gradient-text">
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
                <Button
                  size="default"
                  className="primary-gradient text-white px-4 py-2 text-xs md:text-sm font-medium"
                  onClick={() => handleOpenChange(false)}
                >
                  Закрыть
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Компонент кнопки для открытия калькулятора
export function CalculatorButton({ onClick }: { onClick: () => void }) {
  const isMobile = useMobile();

  return (
    <div className="text-center py-6 md:py-8">
      <div className="mb-2 md:mb-3 max-w-lg mx-auto px-4">
        <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2">Рассчитай свой потенциальный доход</h3>
        <p className="text-sm md:text-base text-muted-foreground mb-3 md:mb-4">
          Используй наш калькулятор чтобы узнать, сколько ты сможешь заработать в качестве курьера
        </p>
      </div>
      <Button
        onClick={onClick}
        className="primary-gradient text-white px-4 py-2 md:px-6 md:py-2.5 rounded-full font-medium mx-auto text-sm md:text-base"
      >
        Открыть калькулятор
      </Button>
    </div>
  );
}
