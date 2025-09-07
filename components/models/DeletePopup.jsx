import React from 'react'

const DeletePopup = () => {
  return (
    <div>
        <div className="w-[456px] h-96 px-8 py-7 left-0 top-0 absolute bg-white rounded-2xl inline-flex flex-col justify-center items-center gap-2.5">
    <div className="w-80 flex flex-col justify-start items-center gap-12">
        <div className="self-stretch flex flex-col justify-start items-center gap-4">
            <div className="w-12 h-12 px-4 py-3 bg-rose-50 rounded-[99px] outline outline-[3px] outline-rose-50/50 inline-flex justify-center items-center gap-3">
                <div className="w-6 h-6 relative">
                    <div className="w-5 h-5 left-[2.50px] top-[2.50px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-red-500" />
                    <div className="w-0 h-1 left-[12px] top-[8px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-red-500" />
                    <div className="w-0 h-[0.01px] left-[12px] top-[15.99px] absolute outline outline-2 outline-offset-[-0.90px] outline-red-500" />
                </div>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
                <div className="self-stretch text-center justify-start text-stone-950 text-xl font-semibold font-['Inter'] leading-relaxed tracking-tight">Delete Account</div>
                <div className="self-stretch text-center justify-start text-neutral-600 text-sm font-normal font-['Inter'] leading-tight tracking-tight">This action is permanent and cannot be undone. All your data will be lost.</div>
            </div>
        </div>
        <div className="self-stretch inline-flex justify-start items-start gap-2">
            <div className="flex-1 h-12 px-4 py-3 bg-slate-50 rounded-xl flex justify-center items-center gap-3">
                <div className="justify-start text-zinc-500 text-base font-medium font-['Inter']">Cancel</div>
            </div>
            <div className="flex-1 h-12 px-4 py-3 bg-red-500 rounded-xl flex justify-center items-center gap-3">
                <div className="justify-start text-white text-base font-medium font-['Inter']">Yes, Delete</div>
            </div>
        </div>
    </div>
</div>
    </div>
  )
}

export default DeletePopup