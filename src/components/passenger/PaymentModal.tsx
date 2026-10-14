import React, { useState } from 'react';
import { RoutePrediction, DigitalTicket, ThemeMode, AppLanguage } from '../../types';
import { playClickSound, playSuccessSound, playAlertSound } from '../../services/soundEffects';
import { TRANSLATIONS } from '../../services/translations';
import {
  X,
  CreditCard,
  QrCode,
  Smartphone,
  WifiOff,
  Ticket,
  CheckCircle2,
  Download,
  ShieldCheck,
  Clock,
  Bus,
  RefreshCw,
  Award,
  Sparkles,
  FileCheck,
  Wind,
  AlertCircle,
  Banknote,
} from 'lucide-react';

interface PaymentModalProps {
  route: RoutePrediction | null;
  onClose: () => void;
  theme: ThemeMode;
  language?: AppLanguage;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  route,
  onClose,
  theme,
  language = 'en',
}) => {
  const [passengerCount, setPassengerCount] = useState<number>(1);
  const [concessionType, setConcessionType] = useState<'General' | 'Student' | 'Senior'>('General');
  const [paymentType, setPaymentType] = useState<
    'online-upi' | 'online-card' | 'offline-ncmc' | 'offline-bluetooth' | 'offline-cash'
  >('online-upi');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [issuedTicket, setIssuedTicket] = useState<DigitalTicket | null>(null);

  // Missed bus refund & switch state
  const [isRefundClaimed, setIsRefundClaimed] = useState<boolean>(false);
  const [refundTxnId, setRefundTxnId] = useState<string | null>(null);
  const [isSwitchedToNextBus, setIsSwitchedToNextBus] = useState<boolean>(false);

  if (!route) return null;

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Pricing calculation
  const baseRate = route.baseFare || (route.id === 'route-18' ? 18 : route.id === 'route-12' ? 14 : 16);
  let perPassengerFare = baseRate;
  if (concessionType === 'Student') perPassengerFare = Math.round(baseRate * 0.5);
  if (concessionType === 'Senior') perPassengerFare = Math.round(baseRate * 0.6);
  const totalFare = perPassengerFare * passengerCount;

  const isOffline = paymentType.startsWith('offline');

  const handlePayAndGenerateTicket = () => {
    playClickSound(800);
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const ticket: DigitalTicket = {
        ticketId: `SF-TN-${Math.floor(100000 + Math.random() * 900000)}`,
        routeNumber: route.routeNumber,
        routeName: route.name,
        fromStop: route.from,
        toStop: route.to,
        passengerCount,
        passType:
          concessionType === 'Student'
            ? 'Student Concession (50% Off)'
            : concessionType === 'Senior'
            ? 'Senior Citizen (Free/Discount)'
            : 'General',
        fareAmount: totalFare,
        paymentMethod:
          paymentType === 'online-upi'
            ? 'UPI (GPay / PhonePe)'
            : paymentType === 'online-card'
            ? 'Debit/Credit Card'
            : paymentType === 'offline-ncmc'
            ? 'NCMC / Smart Card'
            : paymentType === 'offline-bluetooth'
            ? 'Offline Bluetooth Pass'
            : 'Cash to Conductor',
        isOfflineToken: isOffline,
        bookingTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        validUntil: new Date(Date.now() + 1000 * 60 * 180).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }), // 3 hours
        qrPayload: `ROUTEIQ:${route.routeNumber}:${totalFare}:TNSTC`,
        missedBusProtection: true,
        refundPolicySummary: t.missedBusRefundDesc,
      };

      setIssuedTicket(ticket);
      playSuccessSound();
    }, 850);
  };

  const handleClaimMissedBusRefund = () => {
    playAlertSound();
    setIsRefundClaimed(true);
    setRefundTxnId(`REF-UPI-${Math.floor(10000000 + Math.random() * 90000000)}`);
  };

  const handleSwitchToNextBus = () => {
    playSuccessSound();
    setIsSwitchedToNextBus(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div
        className={`w-full max-w-2xl rounded-2xl shadow-2xl border overflow-hidden max-h-[92vh] flex flex-col transition-colors ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div
          className={`px-5 sm:px-6 py-4 border-b flex items-center justify-between ${
            theme === 'dark' ? 'border-slate-800 bg-slate-900/90' : 'border-slate-100 bg-slate-50/90'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-center p-0.5">
              <img
                src="/routeiq-logo.png"
                alt="RouteIQ"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h3 className="text-base font-extrabold tracking-tight">
                {issuedTicket ? 'Official RouteIQ Boarding Pass' : t.onlineOfflinePayment}
              </h3>
              <p className="text-xs text-slate-500">
                {route.routeNumber} · {route.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-5">
          {!issuedTicket ? (
            <>
              {/* Trip & Bus Quality & FC Status Card */}
              <div
                className={`p-4 rounded-xl border space-y-3 ${
                  theme === 'dark' ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 border-slate-200 dark:border-slate-700">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase">
                      <Bus className="w-3.5 h-3.5" />
                      <span>{route.busType}</span>
                      <span className="text-slate-400 font-normal">|</span>
                      <span>{route.vehicleRegistrationNumber || 'TN 38 N 4588'}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                      {route.from} ➔ {route.to}
                    </h4>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[11px] text-slate-500 block">{t.ticketPrice}</span>
                    <span className="text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                      ₹{baseRate}
                    </span>
                  </div>
                </div>

                {/* FC (Fitness Certificate) & Vehicle Quality Details */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  <div className="p-2 rounded-lg bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 uppercase font-semibold">
                      <FileCheck className="w-3 h-3 text-emerald-500" />
                      <span>{t.fcDateLabel}</span>
                    </div>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-[11px] block mt-0.5">
                      {route.fcExpiryDate || '12-Jan-2029'}
                    </span>
                    <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      ● {route.fcStatus || 'Certified Valid'}
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 uppercase font-semibold">
                      <Award className="w-3 h-3 text-amber-500" />
                      <span>{t.vehicleQuality}</span>
                    </div>
                    <span className="font-bold text-amber-600 dark:text-amber-400 text-[11px] block mt-0.5">
                      {route.busQualityGrade || 'Grade A+ (Premium)'}
                    </span>
                    <span className="text-[9px] text-slate-500">
                      Cleanliness: {route.cleanlinessRating || 4.8}★
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 uppercase font-semibold">
                      <Wind className="w-3 h-3 text-sky-500" />
                      <span>{t.aqiLabel}</span>
                    </div>
                    <span className="font-mono font-bold text-sky-600 dark:text-sky-400 text-[11px] block mt-0.5">
                      AQI {route.interiorAqi || 32}
                    </span>
                    <span className="text-[9px] text-emerald-500 font-medium">Fresh Air Sanitized</span>
                  </div>

                  <div className="p-2 rounded-lg bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 uppercase font-semibold">
                      <ShieldCheck className="w-3 h-3 text-emerald-500" />
                      <span>{t.safetyCertLabel}</span>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 block mt-0.5 truncate">
                      {route.safetyCertification || 'AIS-140 GPS & RTO'}
                    </span>
                    <span className="text-[9px] text-slate-500">Speed Governor Active</span>
                  </div>
                </div>
              </div>

              {/* Missed Bus Refund Policy Banner */}
              <div
                className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                  theme === 'dark'
                    ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                }`}
              >
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <div className="flex items-center gap-2 mb-1">
                    <strong className="font-bold">{t.missedBusRefundTitle}</strong>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-500 text-white font-bold">
                      100% Refund
                    </span>
                  </div>
                  <p className="opacity-90">{t.missedBusRefundDesc}</p>
                </div>
              </div>

              {/* Passenger Count & Concessions */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Passengers
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => {
                          playClickSound();
                          setPassengerCount(num);
                        }}
                        className={`flex-1 py-2 text-xs font-bold font-mono rounded-xl border transition-all ${
                          passengerCount === num
                            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-2xs'
                            : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Concession Pass
                  </label>
                  <select
                    value={concessionType}
                    onChange={(e) => {
                      playClickSound();
                      setConcessionType(e.target.value as any);
                    }}
                    className={`w-full px-3 py-2 text-xs font-semibold rounded-xl border outline-none ${
                      theme === 'dark'
                        ? 'bg-slate-800 border-slate-700 text-white'
                        : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="General">General Commuter (Standard)</option>
                    <option value="Student">🎓 {t.studentPass}</option>
                    <option value="Senior">👴 Senior Citizen (40% Off)</option>
                  </select>
                </div>
              </div>

              {/* Online vs Offline Payment Options */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {t.onlinePaymentTitle} & {t.offlinePaymentTitle}
                  </label>
                  {isOffline && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-500 font-semibold">
                      <WifiOff className="w-3 h-3" />
                      <span>Works without Internet</span>
                    </span>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-2.5 text-xs">
                  {/* UPI */}
                  <div
                    onClick={() => {
                      playClickSound();
                      setPaymentType('online-upi');
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      paymentType === 'online-upi'
                        ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/10'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Smartphone className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold">UPI / QR Code</span>
                      <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.2 rounded font-semibold ml-auto">
                        Online Instant
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">Google Pay, PhonePe, Paytm, BHIM</p>
                  </div>

                  {/* Online Cards */}
                  <div
                    onClick={() => {
                      playClickSound();
                      setPaymentType('online-card');
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      paymentType === 'online-card'
                        ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/10'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      <span className="font-bold">Debit / Credit Card</span>
                      <span className="text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-1.5 py-0.2 rounded font-semibold ml-auto">
                        Online
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">RuPay, Visa, MasterCard, Net Banking</p>
                  </div>

                  {/* NCMC / Smart Card */}
                  <div
                    onClick={() => {
                      playClickSound();
                      setPaymentType('offline-ncmc');
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      paymentType === 'offline-ncmc'
                        ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/10'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Banknote className="w-4 h-4 text-purple-600" />
                      <span className="font-bold">NCMC / Chalo Smart Card</span>
                      <span className="text-[10px] bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-1.5 py-0.2 rounded font-semibold ml-auto">
                        Offline NFC Tap
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">One Nation One Card contact-free tap</p>
                  </div>

                  {/* Cash to Conductor */}
                  <div
                    onClick={() => {
                      playClickSound();
                      setPaymentType('offline-cash');
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      paymentType === 'offline-cash'
                        ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/10'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Ticket className="w-4 h-4 text-amber-600" />
                      <span className="font-bold">Cash On-Board Reserve</span>
                      <span className="text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 px-1.5 py-0.2 rounded font-semibold ml-auto">
                        Physical Cash
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">Pay ₹{totalFare} cash to conductor on boarding</p>
                  </div>
                </div>
              </div>

              {/* Total Payable & Security Badge */}
              <div
                className={`p-4 rounded-xl border flex items-center justify-between ${
                  theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-900 text-white'
                }`}
              >
                <div>
                  <span className="text-xs text-slate-400 block">Total Amount to Pay</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black font-mono text-emerald-400">
                      ₹{totalFare}
                    </span>
                    {concessionType !== 'General' && (
                      <span className="text-[11px] text-emerald-300 font-semibold">
                        (Discount Applied)
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>TNSTC Verified Transit Gateway</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handlePayAndGenerateTicket}
                disabled={isProcessing}
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-75"
              >
                {isProcessing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing Digital Transit Ticket...</span>
                  </>
                ) : (
                  <>
                    <Ticket className="w-4 h-4" />
                    <span>Pay ₹{totalFare} & Generate Digital Ticket</span>
                  </>
                )}
              </button>
            </>
          ) : (
            /* Digital Ticket Pass View with Missed Bus Refund Actions */
            <div className="space-y-5 animate-in zoom-in-95">
              <div className="text-center">
                <CheckCircle2 className="w-11 h-11 text-emerald-500 mx-auto mb-1.5" />
                <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {isSwitchedToNextBus
                    ? 'Transfer Pass Re-Issued for Next Bus'
                    : 'Digital Boarding Pass Active'}
                </h4>
                <p className="text-xs text-slate-500">
                  Show this QR code to the conductor or tap validator upon boarding
                </p>
              </div>

              {/* Ticket Card Style */}
              <div
                className={`p-5 rounded-2xl border-2 border-dashed border-emerald-500/50 shadow-md ${
                  theme === 'dark' ? 'bg-slate-800/80' : 'bg-emerald-50/30'
                }`}
              >
                <div className="flex items-center justify-between border-b pb-3 mb-3 border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2.5">
                    <img
                      src="/routeiq-logo.png"
                      alt="RouteIQ"
                      className="w-8 h-8 object-contain"
                    />
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-500">Ticket ID</span>
                      <h5 className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                        {issuedTicket.ticketId}
                      </h5>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-emerald-500 text-slate-950">
                      {isSwitchedToNextBus ? 'Next Bus 18B' : issuedTicket.routeNumber}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                      FC Valid
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 text-xs mb-3">
                  <div>
                    <span className="text-slate-500 block text-[11px]">{t.from}</span>
                    <strong className="text-slate-900 dark:text-white">{issuedTicket.fromStop}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">{t.to}</span>
                    <strong className="text-slate-900 dark:text-white">{issuedTicket.toStop}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Bus Registration & FC</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">
                      {route.vehicleRegistrationNumber || 'TN 38 N 4588'} (Exp: {route.fcExpiryDate || '12-Jan-2029'})
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Valid Until</span>
                    <span className="font-mono font-bold text-amber-500">{issuedTicket.validUntil}</span>
                  </div>
                </div>

                {/* QR Code Canvas */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 w-40 h-40 mx-auto flex flex-col items-center justify-center shadow-xs">
                  <QrCode className="w-28 h-28 text-slate-900" />
                  <span className="text-[9px] font-mono text-slate-500 mt-1">Scan at Turnstile / ETM</span>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-700 text-center text-xs">
                  <span className="text-slate-500">Total Paid: </span>
                  <strong className="font-mono text-emerald-600 dark:text-emerald-400 text-sm">
                    ₹{issuedTicket.fareAmount}
                  </strong>{' '}
                  <span className="text-slate-400">({issuedTicket.paymentMethod})</span>
                </div>
              </div>

              {/* Missed Bus Refund Actions & Status */}
              <div
                className={`p-4 rounded-xl border space-y-3 ${
                  isRefundClaimed
                    ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900'
                    : 'bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {t.missedBusRefundTitle}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    {t.refundGuaranteeBadge}
                  </span>
                </div>

                {!isRefundClaimed && !isSwitchedToNextBus ? (
                  <>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Missed your scheduled departure or experiencing unexpected delay? Choose an option
                      below within 60 minutes:
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        type="button"
                        onClick={handleClaimMissedBusRefund}
                        className="flex-1 py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>{t.claimRefundBtn} (₹{issuedTicket.fareAmount})</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleSwitchToNextBus}
                        className="flex-1 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <Bus className="w-3.5 h-3.5" />
                        <span>{t.rescheduleNextBusBtn}</span>
                      </button>
                    </div>
                  </>
                ) : isRefundClaimed ? (
                  <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-800 dark:text-rose-200 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-rose-600" />
                      <span>{t.refundSuccessMsg.replace('{amount}', String(issuedTicket.fareAmount))}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Refund Reference: <strong className="font-mono">{refundTxnId}</strong>
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Credited back via UPI instant reversal gateway.
                    </p>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-800 dark:text-blue-200 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      <span>{t.rescheduledSuccessMsg}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Boarding pass automatically transferred to the next departure (Route 18B in 12 mins).
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    alert(`Boarding pass ${issuedTicket.ticketId} saved to offline storage.`);
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Save Boarding Pass</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    onClose();
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition-opacity"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
