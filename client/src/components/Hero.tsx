import { useState, useRef } from "react";
import { Button } from "@/lib/ui-components";
import { ChevronRight, Wallet, Clock, Users, Smartphone, Zap, ArrowRight, Download, Phone, Send, CheckCircle2, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IncomeCalculatorModal from "@/components/IncomeCalculatorModal";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from "@/lib/ui-components";

// Импорт иконок магазинов для предзагрузки
import googlePlayIcon from "/icons/google-play.svg";
import appStoreIcon from "/icons/app-store.svg";
import appGalleryIcon from "/icons/appgallery.svg";

const storeIcons = {
  googlePlay: googlePlayIcon,
  appStore: appStoreIcon,
  appGallery: appGalleryIcon
};

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "ФИО должно содержать минимум 2 символа",
  }).max(50, {
    message: "ФИО не должно превышать 50 символов",
  }),
  birthDate: z.string().min(10, {
    message: "Введите дату рождения в формате ДД.ММ.ГГГГ",
  }).regex(/^\d{2}\.\d{2}\.\d{4}$/, {
    message: "Формат даты: ДД.ММ.ГГГГ",
  }),
  phone: z.string()
    .length(13, { message: "Номер должен быть в формате +375XXXXXXXXX" })
    .regex(/^\+375\d{9}$/, { message: "Формат: +375XXXXXXXXX" }),
});

type FormValues = z.infer<typeof formSchema>;

function BackgroundElements() {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      <div className="absolute top-10 right-[5%] w-48 h-48 bg-primary/30 rounded-full filter blur-[60px]"></div>
      <div className="absolute top-[30%] left-[10%] w-56 h-56 bg-secondary/30 rounded-full filter blur-[50px]"></div>
      <div className="absolute bottom-[15%] right-[15%] w-64 h-64 bg-pink-500/20 rounded-full filter blur-[70px]"></div>
      <div className="absolute top-[15%] left-[30%] w-40 h-40 bg-indigo-500/15 rounded-full filter blur-[80px]"></div>
    </div>
  );
}

function PreloadImages() {
  return (
    <div style={{ display: 'none' }} aria-hidden="true">
      <img src={storeIcons.googlePlay} alt="" width="1" height="1" />
      <img src={storeIcons.appStore} alt="" width="1" height="1" />
      <img src={storeIcons.appGallery} alt="" width="1" height="1" />
    </div>
  );
}

export default function Hero() {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPhoneComplete, setIsPhoneComplete] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      birthDate: "",
      phone: "+375",
    },
  });

  const phoneInputRef = useRef<HTMLInputElement>(null);

  const handlePhoneFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const input = e.target;
    setTimeout(() => {
      if (input.selectionStart !== null) {
        if (input.selectionStart < 4) {
          input.setSelectionRange(4, 4);
        }
      }
    });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^\d+]/g, '');
    if (!value.startsWith('+375')) {
      value = '+375' + value.replace(/[^\d]/g, '');
    }
    value = value.slice(0, 13); // +375 + 9 цифр
    form.setValue('phone', value);
    setIsPhoneComplete(value.length === 13);
  };

  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    if (
      (input.selectionStart ?? 0) <= 4 &&
      ["Backspace", "Delete", "ArrowLeft"].includes(e.key)
    ) {
      e.preventDefault();
      input.setSelectionRange(4, 4);
    }
  };

  const handleBirthDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^\d.]/g, '');

    // Автоматическое форматирование ДД.ММ.ГГГГ
    if (value.length === 2 && !value.includes('.')) {
      value = value + '.';
    } else if (value.length === 5 && value.charAt(2) === '.' && !value.includes('.', 3)) {
      value = value + '.';
    }

    form.setValue('birthDate', value);
  };

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    setSubmitStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch('/.netlify/functions/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: values.fullName,
          birthDate: values.birthDate,
          phone: values.phone
        }),
      });

      let responseData = null;
      try {
        if (response.headers.get('content-type')?.includes('application/json')) {
          responseData = await response.json();
        }
      } catch (e) {
        // Игнорируем ошибки парсинга JSON, если ответ пустой
      }

      if (!response.ok) {
        const message = responseData?.message || `Ошибка ${response.status}: ${response.statusText}`;
        throw new Error(message);
      }

      setSubmitStatus("success");
      setIsSuccess(true);

      form.reset({
        fullName: "",
        birthDate: "",
        phone: "+375"
      });
      setIsPhoneComplete(false);

    } catch (error: any) {
      console.error('Submit error:', error);
      setSubmitStatus("error");
      setErrorMessage(error.message || 'Не удалось отправить заявку. Пожалуйста, попробуйте позже.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="relative pt-14 pb-16 overflow-hidden">
      <PreloadImages />
      <BackgroundElements />
      <IncomeCalculatorModal />

      <div className="container-custom">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="lg:w-1/2 z-10">
            <div className="inline-flex items-center px-4 py-2 mb-4 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary font-medium">
              <Zap size={14} className="mr-2" />
              <span>Начни зарабатывать быстро и легко</span>
            </div>
            <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl mb-5 leading-tight tracking-tight">
              Твой <span className="animated-gradient-text animate-text-gradient">быстрый старт</span> в доставке
            </h1>
            <p className="text-lg text-foreground/70 mb-6 max-w-xl">
              Стань курьером с частыми выплатами и гибким графиком.
              Доступно с 16 лет на любой платформе (iOS/Android)
            </p>
            <div className="mt-4 bg-white/80 p-4 rounded-xl border border-primary/10 shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Clock className="text-secondary h-4 w-4" />
                </div>
                <div>
                  <span className="font-medium">Гибкий график</span>
                  <p className="text-sm text-foreground/70">Ты сам выбираешь сколько работать</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Wallet className="text-primary h-4 w-4" />
                </div>
                <div>
                  <span className="font-medium">Стабильный доход</span>
                  <p className="text-sm text-foreground/70">До 5000 BYN/мес при полной занятости</p>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 relative">
            <div className="relative max-w-md mx-auto lg:ml-auto">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-secondary/10 rounded-2xl blur-xl transform rotate-3 scale-105"></div>

              <div className="relative z-10 overflow-hidden rounded-2xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.3)] bg-white/90 backdrop-blur-sm">
                <div className="relative h-[320px] overflow-hidden">
                    <div className="p-4 pt-4 m-0 w-full opacity-100 transition-opacity duration-300"
                    >
                      <div className="text-center mb-5">
                        <h3 className="text-lg font-semibold mb-1">Начни работать с нами</h3>
                        <p className="text-xs text-muted-foreground">Заполните форму и начните зарабатывать уже сегодня</p>
                      </div>
                      {isSuccess ? (
                        <div className="h-full text-center py-4 flex flex-col justify-center items-center">
                          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4 animate-fade-up">
                            <CheckCircle2 className="h-8 w-8 text-green-500" />
                          </div>
                          <h3 className="text-xl font-bold mb-3 font-heading">Заявка успешно отправлена!</h3>
                          <p className="text-muted-foreground mb-6 text-sm max-w-md mx-auto">Наш менеджер свяжется с вами в течение 15 минут для продолжения регистрации.</p>
                          <Button onClick={() => {setIsSuccess(false);setSubmitStatus("idle");setErrorMessage("");}} className="primary-gradient text-white px-5 py-2">Отправить еще заявку</Button>
                        </div>
                      ) : (
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3 max-w-[300px] mx-auto">
                            <FormField control={form.control} name="fullName" render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input {...field} placeholder="ФИО" maxLength={50} className="py-1.5 px-3 text-xs rounded-lg bg-white/70 backdrop-blur-sm border-white/30 text-foreground" />
                                </FormControl>
                                <FormMessage className="text-[10px]" />
                              </FormItem>
                            )} />
                            <FormField control={form.control} name="birthDate" render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <div className="relative group">
                                    <Input type="text" placeholder="Дата рождения (ДД.ММ.ГГГГ)" maxLength={10} value={field.value} onChange={handleBirthDateChange} className="py-1.5 px-3 text-xs rounded-lg bg-white/70 backdrop-blur-sm border-white/30 text-foreground pr-8" />
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                                      <Calendar className="h-3 w-3" />
                                    </div>
                                  </div>
                                </FormControl>
                                <FormMessage className="text-[10px]" />
                              </FormItem>
                            )} />
                            <FormField control={form.control} name="phone" render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <div className="relative group">
                                    <Input
                                      type="text"
                                      inputMode="numeric"
                                      autoComplete="tel"
                                      pattern="\+375\d{9}"
                                      maxLength={13}
                                      value={field.value}
                                      onChange={handlePhoneChange}
                                      onFocus={handlePhoneFocus}
                                      onKeyDown={handlePhoneKeyDown}
                                      placeholder="Номер телефона"
                                      className="py-1.5 px-3 text-xs rounded-lg bg-white/70 backdrop-blur-sm border-white/30 text-foreground pr-7"
                                    />
                                    {isPhoneComplete && (
                                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
                                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                                      </div>
                                    )}
                                  </div>
                                </FormControl>
                                <FormMessage className="text-[10px]" />
                              </FormItem>
                            )} />
                            <Button type="submit" className="w-full primary-gradient text-white py-2 px-4 text-sm font-medium hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 relative overflow-hidden group mt-1" disabled={isSubmitting}>
                              {isSubmitting ? (
                                <div className="flex items-center justify-center gap-2">
                                  <div className="h-3 w-3 rounded-full border-2 border-t-transparent border-white animate-spin" />
                                  <span className="animate-pulse">Отправка...</span>
                                </div>
                              ) : (
                                <div className="flex items-center justify-center gap-2 group-hover:translate-x-1 transition-transform">
                                  Отправить <Send className="h-4 w-4 ml-1" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-lg"></div>
                            </Button>

                          </form>
                        </Form>
                      )}
                    </div>
                </div>
              </div>

              {/* Блок мобильных приложений — современный и визуально крупнее */}
              <div className="relative z-10 mt-5 overflow-hidden rounded-2xl shadow bg-white/90 backdrop-blur py-4 px-4 flex flex-col items-center">
                <p className="text-sm font-semibold mb-2 tracking-wide text-gray-800" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Мобильное приложение для работы
                </p>
                <div className="flex gap-6 md:gap-8 justify-center w-full">
                  <a
                    href="https://play.google.com/store/apps/details?id=ru.yandex.taximeter&hl=ru"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center group focus:outline-none"
                  >
                    <img src={storeIcons.googlePlay} alt="Google Play" width="36" height="36" className="h-9 w-9 rounded-lg shadow-sm group-hover:scale-110 transition-transform" />
                    <span className="text-xs mt-1 text-gray-700 font-medium group-hover:text-primary transition-colors">Google Play</span>
                  </a>
                  <a
                    href="https://apps.apple.com/ru/app/%D1%8F%D0%BD%D0%B4%D0%B5%D0%BA%D1%81-%D0%BF%D1%80%D0%BE-%D0%B2%D0%BE%D0%B4%D0%B8%D1%82%D0%B5%D0%BB%D0%B8-%D0%B8-%D0%BA%D1%83%D1%80%D1%8C%D0%B5%D1%80%D1%8B/id1496904594"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center group focus:outline-none"
                  >
                    <img src={storeIcons.appStore} alt="App Store" width="36" height="36" className="h-9 w-9 rounded-lg shadow-sm group-hover:scale-110 transition-transform" />
                    <span className="text-xs mt-1 text-gray-700 font-medium group-hover:text-primary transition-colors">App Store</span>
                  </a>
                  <a
                    href="https://appgallery.huawei.ru/app/C101435517"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center group focus:outline-none"
                  >
                    <img src={storeIcons.appGallery} alt="AppGallery" width="36" height="36" className="h-9 w-9 rounded-lg shadow-sm group-hover:scale-110 transition-transform" />
                    <span className="text-xs mt-1 text-gray-700 font-medium group-hover:text-primary transition-colors">AppGallery</span>
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
