"use client";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";

interface OTPInputFieldsProps {
  otp: string;
  setOTP: (value: string) => void;
}

const OTPInputSlot = ({ index }: { index: number }) => (
  <InputOTPSlot
    index={index}
    className="w-14 h-14 text-2xl text-center border-2 rounded-lg border-[#cdeae5] focus:border-[#45a193] focus:outline-none"
  />
);

export function OTPInputFields({ otp, setOTP }: OTPInputFieldsProps) {
  const otpSlots = Array.from({ length: 6 }, (_, i) => i);

  return (
    <div className="w-full flex justify-center">
      <InputOTP 
        maxLength={6} 
        pattern={REGEXP_ONLY_DIGITS}
        value={otp}
        onChange={setOTP}
      >
        <InputOTPGroup className="flex gap-4">
          {otpSlots.map((index) => (
            <OTPInputSlot key={index} index={index} />
          ))}
        </InputOTPGroup>
      </InputOTP>
    </div>
  );
}