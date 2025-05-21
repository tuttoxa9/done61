import React, { useState, useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import {
  Button,
  Input,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/lib/ui-components";
import {
  Calendar,
  Clock,
  Search,
  Headset,
  Zap,
  Send,
  CheckCircle2,
  CalendarClock,
  Banknote,
  Shield,
  ArrowUpCircle,
  X,
  AlertCircle,
  ThumbsUp,
  CheckCheck
} from "lucide-react";

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "ФИО должно содержать минимум 2 символа",
  }).max(50, {
    message: "ФИО не должно превышать 50 символов",
  }),
  birthDate: z.string().min(10, {
    message: "Введите дату рождения в формате ДД.ММ.ГГГГ",
  }).regex(/^\d{2}\.\d{2}\.\d{4}$/, {
    message: "Формат: ДД.ММ.ГГГГ"
  }),
  phone: z.string()
    .length(13, { message: "Номер должен быть в формате +375XXXXXXXXX" })
    .regex(/^\+375\d{9}$/, { message: "Формат: +375XXXXXXXXX" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function ApplicationForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPhoneComplete, setIsPhoneComplete] = useState(false);
  const [activeImage, setActiveImage] = useState<string>('/images/man1.webp');
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const images = ['/images/man1.webp', '/images/auto.webp', '/images/bike1.webp'];

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      setIsTransitioning(true);

      setTimeout(() => {
        currentIndex = (currentIndex + 1) % images.length;
        setActiveImage(images[currentIndex]);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 500);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      birthDate: "",
      phone: "+375",
    },
  });

  const phoneInputRef = useRef<HTMLInputElement>(null);
  const birthDateInputRef = useRef<HTMLInputElement>(null);

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

  const handleBirthDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^\d.]/g, '');

    // Автоматическое форматирование даты
    if (value.length === 2 && !value.includes('.')) {
      value += '.';
    } else if (value.length === 5 && value.split('.').length === 2) {
      value += '.';
    }

    // Не более 10 символов (ДД.ММ.ГГГГ)
    value = value.slice(0, 10);

    form.setValue('birthDate', value);
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
      toast({
        title: 'Заявка отправлена!',
        description: 'Мы получили вашу заявку и скоро с вами свяжемся.',
        variant: 'default'
      });

      form.reset({ fullName: "", birthDate: "", phone: "+375" });
      setIsPhoneComplete(false);

      setTimeout(() => {
        document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' });
      }, 300);

    } catch (error: any) {
      console.error('Submit error:', error);
      setSubmitStatus("error");
      setErrorMessage(error.message || 'Не удалось отправить заявку. Пожалуйста, попробуйте позже.');

      toast({
        title: 'Ошибка отправки',
        description: error.message || 'Не удалось отправить заявку.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="apply" className="pt-16 pb-28 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-20 w-80 h-80 bg-primary/25 rounded-full filter blur-[100px]"></div>
        <div className="absolute bottom-10 left-0 w-64 h-64 bg-secondary/25 rounded-full filter blur-[80px]"></div>
        <div className="absolute top-40 left-[30%] w-72 h-72 bg-violet-500/15 rounded-full filter blur-[90px]"></div>
        <div className="absolute -bottom-10 right-[20%] w-80 h-80 bg-pink-500/15 rounded-full filter blur-[70px]"></div>
      </div>

      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-4 py-1.5 mb-4 rounded-full bg-primary/10 backdrop-blur-sm text-sm text-primary font-medium">
            Начни карьеру курьера
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Присоединяйся к <span className="gradient-text">команде</span> уже сегодня
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Заполни простую форму ниже и начни принимать заказы уже через 15 минут после звонка менеджера
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7">
            <div className="glass-card p-10 h-full relative">
              <div className="absolute -z-10 inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl"></div>

              <div className="relative w-full h-64 sm:h-72 md:h-80 rounded-xl overflow-hidden mb-8">
                <div
                  className={`absolute inset-0 bg-cover transition-all duration-500 ${isTransitioning ? 'blur-xl scale-110' : 'blur-0 scale-100'} ${activeImage.includes('man1') ? 'bg-top' : activeImage.includes('auto') ? 'bg-center' : 'bg-center'}`}
                  style={{ backgroundImage: `url(${activeImage})` }}
                />
                <div
                  className={`absolute inset-0 transition-opacity duration-500 bg-gradient-to-t ${activeImage.includes('auto') ? 'from-black/75 to-black/20' : 'from-black/60 to-black/10'}`}
                ></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
                  <h2 className="font-bold text-xl sm:text-2xl md:text-3xl text-center mb-2 sm:mb-4 font-heading">Готовы начать свой финансовый путь с ЮНИК?</h2>
                  <p className="text-white/90 mb-2 sm:mb-4 text-center text-sm sm:text-base md:text-lg">
                    Присоединяйся к команде профессионалов уже сегодня и начни зарабатывать с первого дня
                  </p>
                </div>
              </div>

              <div className="p-4 sm:p-5 glass-card mb-8">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 font-heading justify-center">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white">
                    <Zap className="h-4 w-4" />
                  </div>
                  Как стать курьером?
                </h3>

                <div className="space-y-3 sm:space-y-5">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-blue-500 to-primary shadow-lg flex items-center justify-center text-white font-heading font-bold text-xl sm:text-2xl">1</div>
                    <div className="flex-1 p-3 sm:p-4 rounded-lg bg-blue-100/50 shadow">
                      <p className="font-medium text-base sm:text-lg">Заполни форму заявки</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-blue-500 to-primary shadow-lg flex items-center justify-center text-white font-heading font-bold text-xl sm:text-2xl">2</div>
                    <div className="flex-1 p-3 sm:p-4 rounded-lg bg-blue-100/50 shadow">
                      <p className="font-medium text-base sm:text-lg">Получи звонок от менеджера (15 минут)</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-blue-500 to-primary shadow-lg flex items-center justify-center text-white font-heading font-bold text-xl sm:text-2xl">3</div>
                    <div className="flex-1 p-3 sm:p-4 rounded-lg bg-blue-100/50 shadow">
                      <p className="font-medium text-base sm:text-lg">Начинай доставлять заказы и зарабатывать</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="glass-card p-4 md:p-6 border border-white/20 relative h-full shadow-lg">
              <div className="absolute -z-10 inset-0 bg-gradient-to-tr from-primary/30 via-blue-400/10 to-secondary/20 rounded-xl blur-md"></div>

              {isSuccess ? (
                <div className="h-full flex flex-col justify-center items-center text-center py-10">
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6 animate-fade-up">
                    <CheckCheck className="h-10 w-10 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 font-heading">Заявка успешно отправлена!</h3>
                  <p className="text-muted-foreground mb-8 max-w-md">
                    Наш менеджер свяжется с вами в течение 15 минут для продолжения регистрации и ответов на вопросы.
                  </p>
                  <Button
                    onClick={() => {
                      setIsSuccess(false);
                      setSubmitStatus("idle");
                      setErrorMessage("");
                    }}
                    className="primary-gradient text-white px-6 py-6"
                  >
                    <ThumbsUp className="mr-2 h-5 w-5" /> Отправить еще заявку
                  </Button>
                </div>
              ) : (
                <>
                  <h3 className="font-bold text-xl mb-4 text-center font-heading tracking-tight">
                    Оставь заявку на подключение
                  </h3>

                  {submitStatus === "error" && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-fade">
                      <div className="flex items-start gap-3">
                        <div className="p-1.5 bg-red-100 rounded-full flex-shrink-0">
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        </div>
                        <div>
                          <h4 className="font-medium text-red-800 mb-1">Ошибка при отправке заявки</h4>
                          <p className="text-sm text-red-700">{errorMessage}</p>
                          <p className="text-xs text-red-600 mt-2">Пожалуйста, проверьте данные и попробуйте еще раз</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem className="mb-2">
                            <FormLabel className="text-sm font-medium mb-1">ФИО полностью</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Фамилия Имя Отчество"
                                {...field}
                                maxLength={50}
                                className="py-3 px-3 rounded-lg bg-white/70 backdrop-blur-sm border-white/30 text-foreground text-sm"
                              />
                            </FormControl>
                            <FormMessage className="text-xs mt-1" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="birthDate"
                        render={({ field }) => (
                          <FormItem className="mb-2">
                            <FormLabel className="text-sm font-medium mb-1">Дата рождения</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="ДД.ММ.ГГГГ"
                                {...field}
                                onChange={handleBirthDateInput}
                                ref={birthDateInputRef}
                                inputMode="numeric"
                                maxLength={10}
                                className="py-3 px-3 rounded-lg bg-white/70 backdrop-blur-sm border-white/30 text-foreground text-sm"
                              />
                            </FormControl>
                            <FormMessage className="text-xs mt-1" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem className="mb-2">
                            <FormLabel className="text-sm font-medium mb-1">Номер телефона</FormLabel>
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
                                  className="py-3 px-3 border-0 bg-white/70 w-full focus:ring-0 focus:ring-offset-0 text-foreground text-sm tracking-widest rounded-lg border border-white/30"
                                />
                                {isPhoneComplete && (
                                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center bg-white/20 backdrop-blur-sm p-1 rounded-full">
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                  </div>
                                )}
                              </div>
                            </FormControl>
                            <FormMessage className="text-xs mt-1" />
                          </FormItem>
                        )}
                      />

                      <div className="text-center mt-2">
                        <div className="flex items-center justify-center gap-2 mb-3">
                          <div className="h-px bg-border flex-1"></div>
                          <span className="text-muted-foreground text-xs px-2">или</span>
                          <div className="h-px bg-border flex-1"></div>
                        </div>

                        <a href="https://t.me/xtxa666" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-1 text-primary text-sm font-medium hover:underline">
                          <svg className="h-4 w-4" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                          </svg>
                          Написать в Telegram
                        </a>
                      </div>

                      <Button
                        type="submit"
                        className="w-full primary-gradient text-white py-3 text-sm font-medium hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 relative overflow-hidden group mt-3"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin" />
                            <span className="animate-pulse">Отправка заявки...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-1 group-hover:translate-x-1 transition-transform">
                            Отправить заявку <Send className="h-4 w-4 ml-1" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-xl"></div>
                      </Button>

                      <div className="text-center text-xs text-muted-foreground">
                        Нажимая кнопку, вы соглашаетесь с <a href="#" className="text-primary hover:underline">условиями обработки данных</a>
                      </div>
                    </form>
                  </Form>
                </>
              )}

              <div
                className="absolute -bottom-5 -right-5 p-4 glass-card rounded-xl shadow-lg hidden md:block"
              >
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
