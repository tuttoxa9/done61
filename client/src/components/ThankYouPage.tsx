import { useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowLeft, Phone, MessageCircle } from "lucide-react";
import ShaderLogo from "@/components/ShaderLogo";
import useMobile from "@/hooks/use-mobile";

export default function ThankYouPage() {
  const [location, navigate] = useLocation();
  const isMobile = useMobile();

  // Автоматически перенаправляем на главную, если пользователь зашёл напрямую
  useEffect(() => {
    // Проверяем, есть ли флаг успешной отправки в sessionStorage
    const applicationSent = sessionStorage.getItem('applicationSent');
    if (!applicationSent) {
      navigate('/');
    }
  }, [navigate]);

  const handleGoBack = () => {
    // Убираем флаг и возвращаемся на главную
    sessionStorage.removeItem('applicationSent');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full filter blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/10 rounded-full filter blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-primary/5 rounded-full filter blur-2xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-2xl w-full"
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 md:p-12 text-center">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5, type: "spring", stiffness: 200 }}
            className="mb-8"
          >
            <div className="w-20 h-20 md:w-24 md:h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 md:w-12 md:h-12 text-green-600" />
            </div>
          </motion.div>

          {/* Logo and Brand */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mb-6"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <ShaderLogo width={isMobile ? "30px" : "40px"} height={isMobile ? "30px" : "40px"} />
              <span className="text-2xl md:text-3xl font-bold gradient-text font-heading tracking-tighter">ЮНИК</span>
            </div>
          </motion.div>

          {/* Main Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-2xl md:text-4xl font-bold text-slate-800 mb-4 tracking-tight">
              Спасибо за ваш отклик!
            </h1>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
              Мы получили вашу заявку и свяжемся с вами в ближайшее время.
              Наш менеджер обязательно перезвонит для уточнения деталей.
            </p>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-center md:justify-start text-slate-700">
                <Phone className="w-5 h-5 text-blue-600 mr-3" />
                <span className="text-sm md:text-base">Звонок в течение дня</span>
              </div>
              <div className="flex items-center justify-center md:justify-start text-slate-700">
                <MessageCircle className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-sm md:text-base">Консультация бесплатно</span>
              </div>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mb-8"
          >
            <p className="text-slate-500 text-sm md:text-base mb-2">
              Если у вас есть срочные вопросы, вы можете связаться с нами:
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <a
                href="tel:+375333513320"
                className="text-blue-600 hover:text-blue-700 transition-colors font-medium"
              >
                +375 33 351-33-20
              </a>
              <span className="hidden sm:inline text-slate-400">•</span>
              <a
                href="https://t.me/xtxa666"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700 transition-colors font-medium flex items-center gap-1"
              >
                <MessageCircle className="w-4 h-4" />
                Телеграм
              </a>
            </div>
          </motion.div>

          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Button
              onClick={handleGoBack}
              className="primary-gradient text-white font-medium px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Вернуться на главную
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
