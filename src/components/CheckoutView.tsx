import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Truck, CreditCard, CheckCircle, 
  Loader2, ArrowLeft, ShoppingBag, Gift, Sparkles,
  ChevronRight, Heart, Star, Shield, Lock, 
  MapPin, Gift as GiftIcon, Check, Box, DollarSign
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CartItem, AppConfig, CheckoutData, CompanyId, CheckoutAddon, SiteSettings } from '../types';
import { formatCurrency } from '../lib/currencyUtils';
import { themes } from '../lib/theme';
import { sendNotifications } from '../services/notificationService';
import { 
  saveSale, subscribeToAddons, getSiteSettings, 
  subscribeToPrizes, updateOrder 
} from '../services/firebaseService';
import { PrizeRouletteModal } from './PrizeRouletteModal';
import { ImageWithFallback } from './ImageWithFallback';

interface CheckoutViewProps {
  cart: CartItem[];
  companyId: CompanyId;
  config: AppConfig;
  onCheckoutComplete: () => void;
  onClearCart: () => void;
}

const Monogram: React.FC<{ companyId: CompanyId; color: string }> = ({ companyId, color }) => {
  const initials = { pallyra: 'LP', guennita: 'CG', mimada: 'MS' }[companyId] || 'LP';
  return (
    <div className="w-16 h-16 rounded-3xl flex items-center justify-center text-white font-fancy text-2xl shadow-xl relative overflow-hidden group" style={{ backgroundColor: color }}>
      <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent opacity-50" />
      <span className="relative z-10 group-hover:scale-110 transition-transform duration-500">{initials}</span>
    </div>
  );
};

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  cart, companyId, config, onCheckoutComplete, onClearCart
}) => {
  const navigate = useNavigate();
  const theme = themes[companyId] || themes.pallyra;
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [addons, setAddons] = useState<CheckoutAddon[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<CheckoutData>({
    name: "", birthDate: "", cpfCnpj: "", contact: "", deliveryType: "pickup",
    address: "", city: "", state: "", zipCode: "", paymentMethod: "pix",
    installments: 1, needsChange: "NÃO", changeAmount: "", observations: "", isEmergency: false,
    selectedAddons: [], addonMessage: ""
  });
  const [showRoulette, setShowRoulette] = useState(false);
  const [orderCode, setOrderCode] = useState<string | null>(null);
  const [wonPrize, setWonPrize] = useState<string | null>(null);
  const [prizes, setPrizes] = useState<any[]>([]);
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);

  const atelierName = { pallyra: 'La Pallyra', guennita: 'Com Amor, Guennita', mimada: 'Mimada Sim' }[companyId] || 'Atelier';

  useEffect(() => {
    const unsub = subscribeToAddons((data) => {
      setAddons(data.filter(a => a.active) as CheckoutAddon[]);
    }, companyId);
    
    getSiteSettings(companyId).then(setSiteSettings);

    const unsubPrizes = subscribeToPrizes((loadedPrizes) => {
      setPrizes(loadedPrizes || []);
    }, companyId);

    return () => {
      unsub();
      unsubPrizes();
    };
  }, [companyId]);

  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + (item.retail_price * item.quantity), 0), [cart]);
  const addonTotal = useMemo(() => (formData.selectedAddons || []).reduce((sum, id) => {
    const addon = addons.find(a => a.id === id);
    return sum + (addon?.price || 0);
  }, 0), [formData.selectedAddons, addons]);
  
  const emergencyFee = formData.isEmergency ? 25 : 0;
  const total = subtotal + addonTotal + emergencyFee;

  const toggleAddon = (id: string) => {
    setFormData(prev => {
      const selected = prev.selectedAddons || [];
      const newSelected = selected.includes(id) 
        ? selected.filter(i => i !== id) 
        : [...selected, id];
      return { ...prev, selectedAddons: newSelected };
    });
  };

  const isCartaoSelected = useMemo(() => {
    const cartao = addons.find(a => a.name.toLowerCase().includes('cartão com mensagem'));
    return cartao && formData.selectedAddons?.includes(cartao.id);
  }, [addons, formData.selectedAddons]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) { setStep(step + 1); window.scrollTo(0, 0); return; }
    setIsLoading(true);
    try {
      const result = await saveSale({
        customerName: formData.name, 
        total, 
        companyId, 
        deliveryType: formData.deliveryType,
        paymentMethod: formData.paymentMethod, 
        items: cart as any, 
        isEmergency: !!formData.isEmergency,
        contact: formData.contact, 
        customerCpfCnpj: formData.cpfCnpj,
        observations: formData.observations,
        addonMessage: formData.addonMessage,
        addons: addons.filter(a => formData.selectedAddons?.includes(a.id)).map(a => a.name)
      });
      
      const savedOrderCode = result; // Assuming saveSale returns the code or ID
      setOrderCode(savedOrderCode);

      const waUrl = await sendNotifications(config, cart, formData, total, atelierName);
      setWhatsappUrl(waUrl);
      
      console.log("Checkout total:", total);
      if (total >= 300) {
        console.log("Showing roulette...");
        setShowRoulette(true);
      } else {
        console.log("Total below threshold for roulette");
      }

      setIsSuccess(true);
      onCheckoutComplete();
    } catch (error) { alert("Erro ao processar pedido."); } finally { setIsLoading(false); }
  };

  if (isSuccess) return (
    <div className={`min-h-screen ${theme.bg} flex items-center justify-center p-6 text-center relative overflow-hidden`}>
      {/* Burst Animation from SuccessOverlay */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        {[...Array(40)].map((_, i) => {
          const angle = (i / 40) * Math.PI * 2;
          const distance = 400 + Math.random() * 400;
          const tx = Math.cos(angle) * distance;
          const ty = Math.sin(angle) * distance;
          return (
            <motion.div
              key={`burst-${i}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1, 0.5], x: [0, tx], y: [0, ty] }}
              transition={{ duration: 2, repeat: Infinity, delay: Math.random() * 2 }}
              className="absolute text-2xl opacity-20"
              style={{ color: theme.accentColor }}
            >
              {['✧', '✦', '⋆', '✨', '⭐'][Math.floor(Math.random() * 5)]}
            </motion.div>
          );
        })}
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} className={`max-w-xl w-full ${theme.cardBg} rounded-[4rem] p-12 md:p-16 shadow-2xl space-y-10 relative z-10 border-4`} style={{ borderColor: theme.accentColor + '10' }}>
        <div className="space-y-6">
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            transition={{ type: 'spring', damping: 12, delay: 0.2 }}
            className="w-24 h-24 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto border-8 border-emerald-500/10"
          >
            <CheckCircle size={48} />
          </motion.div>
          
          <div className="space-y-4">
            <h1 className={`text-4xl md:text-5xl font-fancy ${theme.textPrimary}`}>Pedido Confirmado!</h1>
            <p className="text-xl md:text-2xl font-hand tracking-wide leading-tight px-4" style={{ color: theme.accentColor }}>
              Agradecemos pela oportunidade de participar desse momento especial. 💖
            </p>
            <p className={`${theme.textSecondary} text-xs uppercase font-black tracking-widest opacity-60`}>
              Aguardamos você no WhatsApp para os detalhes finais.
            </p>
          </div>
        </div>
        
        <AnimatePresence>
          {(wonPrize || total < 300) ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 w-full"
            >
              {whatsappUrl && (
                <motion.button 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  onClick={() => window.open(whatsappUrl, '_blank')}
                  className="w-full py-6 rounded-3xl text-white font-black uppercase text-sm tracking-[0.2em] shadow-xl flex items-center justify-center gap-4 transition-all hover:scale-[1.02] active:scale-[0.98] hover:shadow-2xl"
                  style={{ backgroundColor: '#25D366' }}
                >
                  <ShoppingBag size={20} />
                  Finalizar no WhatsApp
                </motion.button>
              )}

              {wonPrize && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-8 rounded-[3rem] border-2 border-dashed relative group overflow-hidden"
                  style={{ borderColor: theme.accentColor + '40', backgroundColor: theme.accentColor + '05' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${theme.textPrimary} relative z-10`}>O SEU BRINDE:</p>
                  <p className={`text-2xl font-fancy mt-3 ${theme.textPrimary} relative z-10`}>{wonPrize}</p>
                  <p className="text-[10px] text-gray-400 mt-3 font-bold uppercase tracking-widest relative z-10">O brinde foi adicionado ao seu pedido! ♡</p>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-10 rounded-[3rem] bg-slate-50 border-2 border-dashed border-slate-200"
            >
              <Gift size={32} className="mx-auto mb-4 text-slate-300" />
              <p className="text-sm font-bold uppercase tracking-widest text-slate-400 italic">
                Aguarde... temos um brinde para você! ✨
              </p>
              <button 
                onClick={() => setShowRoulette(true)}
                className="mt-6 px-10 py-4 rounded-2xl text-white font-bold uppercase text-[10px] tracking-widest"
                style={{ backgroundColor: theme.accentColor }}
              >
                Abrir Roleta
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={() => {
            onClearCart();
            navigate(`/${companyId}`);
          }} 
          className="w-full py-5 rounded-2xl text-white font-black uppercase text-[10px] tracking-widest shadow-lg opacity-60 hover:opacity-100 transition-all border border-white/20" 
          style={{ backgroundColor: theme.accentColor }}
        >
          Voltar ao Catálogo
        </button>
      </motion.div>
      {showRoulette && (
        <PrizeRouletteModal 
          isOpen={showRoulette}
          onClose={() => setShowRoulette(false)}
          onResult={async (prize) => {
            setWonPrize(prize);
            if (orderCode) {
              await updateOrder(orderCode, { 
                roulettePrize: prize,
                roulettePlayed: true,
                updatedAt: new Date().toISOString() // Using ISO string for simplicity or check if serverTimestamp is available
              } as any);
            }
            // Update WhatsApp URL to include prize
            const updatedUrl = await sendNotifications(config, cart, { ...formData, wonPrize: prize, roulettePrize: prize, roulettePlayed: true }, total, atelierName);
            setWhatsappUrl(updatedUrl);
          }}
          prizes={prizes.length > 0 ? prizes.map(p => ({ ...p, active: true })) : []}
          theme={{ accentColor: theme.accentColor }}
        />
      )}
    </div>
  );

  return (
    <div className={`min-h-screen ${theme.bg} font-sans pb-20`}>
      <header className={`${theme.cardBg} border-b ${theme.borderLine} px-6 py-8 md:px-12 relative overflow-hidden`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-6">
              <Monogram companyId={companyId} color={theme.accentColor} />
              <div className="flex flex-col">
                <h1 className={`text-2xl md:text-3xl font-elegant ${theme.textPrimary}`}>{atelierName}</h1>
                <p className={`text-[9px] font-black uppercase tracking-[0.3em] mt-1 ${theme.textSecondary}`}>Excelência em Cada Detalhe</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {[ 
                { s: 1, label: 'Dados', i: User }, 
                { s: 2, label: 'Toque Final', i: Sparkles },
                { s: 3, label: 'Entrega', i: Truck }, 
                { s: 4, label: 'Pagamento', i: CreditCard } 
              ].map((item, idx) => (
                <React.Fragment key={`checkout-step-${item.s}-${idx}`}>
                  <div className={`flex flex-col items-center gap-1.5 transition-all duration-500 ${step >= item.s ? 'opacity-100 scale-100' : 'opacity-30 scale-90'}`}>
                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-2xl flex items-center justify-center transition-colors ${step >= item.s ? `${theme.btnPrimary} shadow-lg ` : `${theme.searchBg} ${theme.textMuted}`}`} style={step >= item.s ? { backgroundColor: theme.accentColor } : {}}><item.i size={step >= item.s ? 18 : 14} /></div>
                    <span className="text-[7px] font-black uppercase tracking-widest hidden md:block">{item.label}</span>
                  </div>
                  {idx < 3 && <div className={`hidden md:block w-4 h-px transition-colors ${step > item.s ? 'bg-rose-500' : 'bg-rose-100'}`} style={step > item.s ? { backgroundColor: theme.accentColor } : {}} />}
                </React.Fragment>
              ))}
            </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
        {(siteSettings?.checkout_banner || config.checkout_banner) && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`w-full aspect-[1800/300] ${theme.searchBg} rounded-[2rem] overflow-hidden shadow-xl mb-10 border border-white`}
          >
            <ImageWithFallback 
              src={siteSettings?.checkout_banner || config.checkout_banner || ''} 
              alt="Checkout Banner" 
              className="w-full h-full object-cover" 
            />
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-10">
            <form onSubmit={handleSubmit} className="space-y-10">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={step} 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`${theme.cardBg} rounded-[3rem] p-8 md:p-14 shadow-2xl border ${theme.borderLine} space-y-10`}
                >
                  {step === 1 && (
                    <div className="space-y-10">
                      <div className="space-y-2">
                        <h2 className={`text-xl md:text-2xl font-black uppercase tracking-tighter italic ${theme.textPrimary}`}>Identificação</h2>
                        <p className={`text-[10px] font-bold uppercase tracking-widest ${theme.textMuted}`}>Preencha seus dados para começar</p>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                          <label className={`text-[9px] uppercase font-black ${theme.textSecondary} ml-5`}>Nome Completo</label>
                          <input 
                            required 
                            className={`w-full ${theme.bg} rounded-[2rem] px-8 py-5 outline-none font-bold text-sm border-2 border-transparent focus:${theme.borderLine} transition-all shadow-inner ${theme.textPrimary}`}
                            placeholder="Ex: Maria Oliveira Santos" 
                            value={formData.name} 
                            onChange={e => setFormData({...formData, name: e.target.value})} 
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className={`text-[9px] uppercase font-black ${theme.textSecondary} ml-5`}>WhatsApp (Contato)</label>
                            <input 
                              required 
                              className={`w-full ${theme.bg} rounded-[2rem] px-8 py-5 outline-none font-bold text-sm border-2 border-transparent focus:${theme.borderLine} transition-all shadow-inner ${theme.textPrimary}`}
                              placeholder="(00) 00000-0000" 
                              value={formData.contact} 
                              onChange={e => setFormData({...formData, contact: e.target.value})} 
                            />
                          </div>
                          <div className="space-y-2">
                            <label className={`text-[9px] uppercase font-black ${theme.textSecondary} ml-5`}>CPF / CNPJ</label>
                            <input 
                              required 
                              className={`w-full ${theme.bg} rounded-[2rem] px-8 py-5 outline-none font-bold text-sm border-2 border-transparent focus:${theme.borderLine} transition-all shadow-inner ${theme.textPrimary}`}
                              placeholder="000.000.000-00" 
                              value={formData.cpfCnpj} 
                              onChange={e => setFormData({...formData, cpfCnpj: e.target.value})} 
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-10">
                      <div className="space-y-2">
                        <h2 className={`text-xl md:text-2xl font-black uppercase tracking-tighter italic ${theme.textPrimary}`}>Toque Final</h2>
                        <p className={`text-[10px] font-bold uppercase tracking-widest ${theme.textMuted}`}>Personalize ainda mais o seu pedido</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                        {addons.map((addon) => (
                          <button 
                            key={addon.id} 
                            type="button"
                            onClick={() => toggleAddon(addon.id)} 
                            className={`flex items-center gap-4 p-4 rounded-[2rem] border-2 transition-all text-left relative group overflow-hidden ${formData.selectedAddons?.includes(addon.id) ? `${theme.borderLine} shadow-sm` : `border-gray-50 ${theme.bg}`}`}
                            style={formData.selectedAddons?.includes(addon.id) ? { borderColor: theme.accentColor, backgroundColor: theme.accentColor + '15' } : {}}
                          >
                            <div className={`w-14 h-14 rounded-2xl ${theme.cardBg} border ${theme.borderLine} flex items-center justify-center text-2xl shrink-0 shadow-sm overflow-hidden`}>
                              {addon.image.length > 5 ? (
                                <ImageWithFallback src={addon.image} alt={addon.name} className="w-full h-full object-cover" />
                              ) : (
                                addon.image || '🎁'
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-[9px] font-black uppercase tracking-widest ${theme.textPrimary} truncate`}>{addon.name}</p>
                              <p className={`text-sm font-elegant ${theme.specialText}`}>{formatCurrency(addon.price)}</p>
                            </div>
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${formData.selectedAddons?.includes(addon.id) ? `${theme.btnPrimary}` : `${theme.cardBg} border ${theme.borderLine}`}`} style={formData.selectedAddons?.includes(addon.id) ? { backgroundColor: theme.accentColor } : {}}>
                              {formData.selectedAddons?.includes(addon.id) && <Check size={14} />}
                            </div>
                          </button>
                        ))}
                      </div>

                      {isCartaoSelected && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="space-y-3"
                        >
                          <label className={`text-[10px] uppercase font-black ${theme.textSecondary} ml-5`}>Mensagem do Cartão (Máx 150 caracteres)</label>
                          <div className="relative">
                            <textarea 
                              maxLength={150}
                              className={`w-full ${theme.bg} rounded-[2rem] px-8 py-6 outline-none font-medium text-sm border-2 border-transparent focus:${theme.borderLine} transition-all shadow-inner h-32 resize-none ${theme.textPrimary}`}
                              placeholder="Escreva sua mensagem aqui..."
                              value={formData.addonMessage}
                              onChange={e => setFormData({...formData, addonMessage: e.target.value})}
                            />
                            <span className={`absolute bottom-6 right-8 text-[9px] font-black ${theme.textVeryMuted} uppercase tracking-widest`}>
                              {formData.addonMessage?.length || 0} / 150
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-10">
                      <div className="space-y-2">
                        <h2 className={`text-xl md:text-2xl font-black uppercase tracking-tighter italic ${theme.textPrimary}`}>Forma de Entrega</h2>
                        <p className={`text-[10px] font-bold uppercase tracking-widest ${theme.textMuted}`}>Como você quer receber seu pedido?</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { id: 'pickup', label: 'Retirada', icon: MapPin },
                          { id: 'delivery', label: 'Entrega Local', icon: Truck },
                          { id: 'shipping', label: 'Envio (Correios)', icon: Box }
                        ].map(type => (
                          <button 
                            key={type.id} 
                            type="button" 
                            onClick={() => setFormData({...formData, deliveryType: type.id as any})} 
                            className={`p-8 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-3 ${formData.deliveryType === type.id ? `${theme.borderLine} shadow-md` : `border-gray-50 ${theme.bg}`}`}
                            style={formData.deliveryType === type.id ? { borderColor: theme.accentColor, backgroundColor: theme.accentColor + '15' } : {}}
                          >
                            <type.icon size={24} className={formData.deliveryType === type.id ? 'text-rose-500' : `${theme.textVeryMuted}`} style={formData.deliveryType === type.id ? { color: theme.accentColor } : {}} />
                            <span className={`text-[10px] font-black uppercase tracking-widest ${theme.textPrimary}`}>{type.label}</span>
                          </button>
                        ))}
                      </div>

                      {formData.deliveryType !== 'pickup' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="md:col-span-1 space-y-2">
                            <label className={`text-[9px] uppercase font-black ${theme.textSecondary} ml-5`}>CEP</label>
                            <input required className={`w-full ${theme.bg} rounded-[2rem] px-8 py-5 outline-none font-bold text-sm border-2 ${theme.borderLine} ${theme.textPrimary}`} placeholder="00000-000" value={formData.zipCode} onChange={e => setFormData({...formData, zipCode: e.target.value})} />
                          </div>
                          <div className="md:col-span-2 space-y-2">
                            <label className={`text-[9px] uppercase font-black ${theme.textSecondary} ml-5`}>Endereço Completo</label>
                            <input required className={`w-full ${theme.bg} rounded-[2rem] px-8 py-5 outline-none font-bold text-sm border-2 ${theme.borderLine} ${theme.textPrimary}`} placeholder="Rua, Número, Bairro, Cidade..." value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {step === 4 && (
                    <div className="space-y-10">
                      <div className="space-y-2">
                        <h2 className={`text-xl md:text-2xl font-black uppercase tracking-tighter italic ${theme.textPrimary}`}>Pagamento</h2>
                        <p className={`text-[10px] font-bold uppercase tracking-widest ${theme.textMuted}`}>Escolha a melhor opção para você</p>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { id: 'pix', label: 'PIX (À Vista)', icon: CheckCircle },
                          { id: 'pix_parcelado', label: 'PIX Parcelado', icon: Sparkles },
                          { id: 'credit_card', label: 'Cartão Crédito', icon: CreditCard },
                          { id: 'cash', label: 'Dinheiro', icon: DollarSign }
                        ].map(m => (
                          <button 
                            key={m.id} 
                            type="button" 
                            onClick={() => setFormData({...formData, paymentMethod: m.id as any})} 
                            className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-3 ${formData.paymentMethod === m.id ? `${theme.borderLine} shadow-sm` : `border-gray-50 ${theme.bg}`}`}
                            style={formData.paymentMethod === m.id ? { borderColor: theme.accentColor, backgroundColor: theme.accentColor + '15' } : {}}
                          >
                            <span className={`text-[9px] font-black uppercase tracking-[0.1em] text-center leading-tight ${theme.textPrimary}`}>{m.label}</span>
                          </button>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <label className={`text-[10px] uppercase font-black ${theme.textSecondary} ml-5`}>Obervações Adicionais</label>
                        <textarea className={`w-full ${theme.bg} rounded-[2.5rem] px-8 py-6 outline-none text-sm min-h-[120px] shadow-inner font-medium ${theme.textPrimary}`} placeholder="Ex: Gosto da caixa bem laqueada, adicionar flores brancas..." value={formData.observations} onChange={e => setFormData({...formData, observations: e.target.value})} />
                      </div>

                      <button type="button" onClick={() => setFormData({...formData, isEmergency: !formData.isEmergency})} className={`w-full p-8 rounded-[3rem] border-2 flex items-center gap-6 transition-all ${formData.isEmergency ? 'border-amber-500 bg-amber-50 shadow-xl shadow-amber-200/20' : `${theme.bg} border-gray-50`}`}>
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${formData.isEmergency ? `${theme.specialBg} ${theme.textPrimary}` : `${theme.cardBg} ${theme.textVeryMuted}`}`} style={formData.isEmergency ? { backgroundColor: theme.accentColor + '20', color: theme.accentColor } : {}}>
                          <Sparkles size={24} />
                        </div>
                        <div className="text-left">
                          <p className={`text-[11px] font-black uppercase tracking-widest ${theme.textPrimary}`}>Produção Flash (Urgência)</p>
                          <p className={`text-[9px] ${theme.textSecondary} mt-0.5 font-bold uppercase tracking-widest`}>Taxa fixa de {formatCurrency(25)} para prioridade total na produção.</p>
                        </div>
                      </button>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="flex gap-6">
                {step > 1 && (
                  <button 
                    type="button" 
                    onClick={() => setStep(step - 1)} 
                    className={`px-10 py-6 rounded-[2rem] border ${theme.borderLine} ${theme.textMuted} text-[10px] uppercase font-black tracking-widest hover:bg-gray-50 transition-all`}
                  >
                    Voltar
                  </button>
                )}
                <button 
                  type="submit" 
                  disabled={isLoading} 
                  className="flex-1 py-6 rounded-[2rem] text-white font-black uppercase text-[11px] tracking-[0.2em] shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center" 
                  style={{ backgroundColor: theme.accentColor }}
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <span className="flex items-center gap-3 text-white">
                      {step < 4 ? 'Continuar Pedido' : 'Finalizar no WhatsApp'}
                      <ChevronRight size={18} />
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>

          <aside className="lg:col-span-4 lg:sticky lg:top-8 space-y-8 h-fit">
            <div className={`${theme.cardBg} rounded-[3rem] p-10 shadow-2xl border ${theme.borderLine} space-y-8`}>
              <div className="flex items-center justify-between">
                <h3 className={`text-[11px] font-black uppercase tracking-[0.2em] ${theme.textPrimary} flex items-center gap-2`}><ShoppingBag size={14} style={{ color: theme.accentColor }} /> Resumo</h3>
                <span className={`text-[8px] font-black uppercase px-3 py-1 rounded-full`} style={{ backgroundColor: theme.accentColor + '20', color: theme.accentColor }}>{cart.reduce((a, b) => a + b.quantity, 0)} Itens</span>
              </div>

              <div className="space-y-6 max-h-[35vh] overflow-y-auto pr-2 scrollbar-hide">
                {cart.map((i, idx) => (
                  <div key={`cart-item-${i.id}-${idx}`} className="flex gap-4">
                    <div className={`w-16 h-16 rounded-2xl overflow-hidden ${theme.bg} shrink-0 border ${theme.borderLine} shadow-sm`}><ImageWithFallback src={i.image} alt={i.product_name} className="w-full h-full object-cover" /></div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[10px] font-black uppercase tracking-widest truncate leading-relaxed ${theme.textPrimary}`}>{i.product_name}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${theme.textMuted}`}>{i.quantity}x</span>
                        <span className={`text-[11px] font-black ${theme.textPrimary}`}>{formatCurrency(i.retail_price * i.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {addons.filter(a => formData.selectedAddons?.includes(a.id)).map((a, idx) => (
                  <div key={`addon-resum-${a.id}-${idx}`} className="flex gap-4">
                    <div className={`w-16 h-16 rounded-2xl ${theme.searchBg} flex items-center justify-center shrink-0 border ${theme.borderLine}`}>
                      {a.image.length > 5 ? <ImageWithFallback src={a.image} className="w-full h-full object-cover rounded-2xl" /> : <span className="text-2xl">{a.image || '✨'}</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[9px] font-black uppercase tracking-widest truncate leading-relaxed ${theme.textSecondary}`}>Adicional: {a.name}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className={`text-[9px] font-black uppercase tracking-widest ${theme.textVeryMuted}`}>1x</span>
                        <span className={`text-[11px] font-black ${theme.textPrimary}`}>{formatCurrency(a.price)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className={`pt-8 border-t ${theme.borderLine} space-y-4`}>
                <div className={`flex justify-between text-[10px] font-black uppercase tracking-widest ${theme.textSecondary}`}><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
                {addonTotal > 0 && <div className="flex justify-between text-[10px] font-black uppercase tracking-widest" style={{ color: theme.accentColor }}><span>Toque Final</span><span>+{formatCurrency(addonTotal)}</span></div>}
                {emergencyFee > 0 && <div className="flex justify-between text-[10px] font-black text-amber-500 uppercase tracking-widest"><span>Urgência</span><span>+R$ 25,00</span></div>}
                <div className={`pt-6 border-t-2 ${theme.borderLine} flex justify-between items-end`}>
                  <div className="flex flex-col">
                    <span className={`text-[9px] font-black uppercase tracking-widest ${theme.textVeryMuted}`}>Total Geral</span>
                    <span className={`text-4xl font-elegant ${theme.textPrimary}`}>{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={`${theme.cardBg} rounded-[2.5rem] p-6 border ${theme.borderLine} flex items-center gap-4`}>
              <div className={`w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center border ${theme.borderLine}`}><Shield size={20} /></div>
              <div><p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Checkout Seguro</p><p className="text-[8px] text-emerald-400 font-bold uppercase">Seus dados estão protegidos</p></div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
