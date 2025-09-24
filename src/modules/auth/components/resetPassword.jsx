export function ResetPasswordPage() {

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e6f4f2] px-10 py-3">
          <div className="flex items-center gap-4 text-[#0c1d1a]">
            <div className="size-4">
              <div className="w-4 h-4 bg-[#0c1d1a] rounded-sm"></div>
            </div>
            <h2 className="text-[#0c1d1a] text-lg font-bold leading-tight tracking-[-0.015em]">DevCollab</h2>
          </div>
        </header>

        {/* Main Content */}
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-[512px] max-w-[512px] py-5 max-w-[960px] flex-1">
            <div className="w-full" style={{height: '100px'}}></div>
            
            {/* Title */}
            <h2 className="text-[#0c1d1a] tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">
              Reset your password
            </h2>
            <p className="text-[#0c1d1a] text-base font-normal leading-normal pb-8 pt-1 px-4 text-center">
              Enter your new password below
            </p>

            {/* New Password Field */}
            <div className="flex justify-center">
              <div className="flex max-w-[480px] w-full flex-wrap items-end gap-4 px-4 py-3">
                <label className="flex flex-col min-w-40 flex-1">
                  <input
                    type="password"
                    placeholder="New Password"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded text-[#0c1d1a] focus:outline-0 focus:ring-0 border border-[#cdeae5] bg-white focus:border-[#cdeae5] h-14 placeholder:text-[#45a193] p-[15px] text-base font-normal leading-normal"
                  />
                </label>
              </div>
            </div>

            {/* Confirm New Password Field */}
            <div className="flex justify-center">
              <div className="flex max-w-[480px] w-full flex-wrap items-end gap-4 px-4 py-3">
                <label className="flex flex-col min-w-40 flex-1">
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded text-[#0c1d1a] focus:outline-0 focus:ring-0 border border-[#cdeae5] bg-white focus:border-[#cdeae5] h-14 placeholder:text-[#45a193] p-[15px] text-base font-normal leading-normal"
                  />
                </label>
              </div>
            </div>

            {/* Reset Password Button */}
            <div className="flex justify-center">
              <div className="flex max-w-[480px] w-full px-4 py-6">
                <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded h-12 px-5 w-full bg-[#006b5b] text-white text-base font-bold leading-normal tracking-[0.015em]">
                  <span className="truncate">Reset Password</span>
                </button>
              </div>
            </div>

            {/* Back to Login Link */}
            <div className="flex justify-center px-4">
              <button className="text-[#45a193] text-sm font-normal leading-normal underline cursor-pointer">
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}