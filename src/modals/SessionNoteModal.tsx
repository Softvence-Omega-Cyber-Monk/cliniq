import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Calendar, XIcon } from "lucide-react";
import React from "react";

interface SessionNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: {
    date: string;
    duration: number;
    fullNote: string;
  } | null;
}

const SessionNoteModal: React.FC<SessionNoteModalProps> = ({
  isOpen,
  onClose,
  session,
}) => {
  if (!session) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[840px] max-h-[90vh] p-0 overflow-hidden bg-[#FAFAF7] border-none flex flex-col gap-0">
        {/* HEADER */}
        <DialogHeader className="p-6 ">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-medium">
              Session Details
            </DialogTitle>

            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full border text-[#3FDCBF] bg-[#3FDCBF26]"
            >
              <XIcon size={22} />
            </Button>
          </div>

          <DialogDescription className="text-sm text-[#7E8086]">
            Detailed information about this therapy session
          </DialogDescription>
        </DialogHeader>

        {/* CONTENT */}
        <ScrollArea className="px-6 pb-6 space-y-6 max-h-[60vh]">
          {/* Date + Duration */}
          <div className="flex justify-between items-center bg-[#EBEBEC4D] p-4 rounded-xl ">
            <div className="flex gap-2.5 ">
              <Calendar className="text-website-primary-color" />
              <span className="font-medium text-[#32363F]">
                {new Date("2025-11-28T12:41:49.197Z").toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </span>
            </div>
            <span className="text-sm  px-2 py-0.5 rounded bg-[#298CDF1A] text-[#298CDF]">
              {session.duration} min
            </span>
          </div>

          {/* Full Notes */}
          <div className="space-y-3 mt-6">
            <h3 className="text-basic font-medium ">Session Notes</h3>
            <div className="bg-[#EBEBEC] p-4 rounded-xl  shadow-inner max-h-80 overflow-y-auto">
              <p className="text-[#575A62] whitespace-pre-wrap leading-relaxed">
                {session.fullNote}
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default SessionNoteModal;
