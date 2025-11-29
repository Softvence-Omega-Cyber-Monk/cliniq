import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function SessionHistoryModal({
  onSubmit,
}: {
  onSubmit: (data: any) => void;
}) {
  const [form, setForm] = useState({
    sessionDate: "",
    notes: "",
    duration: "",
    sessionType: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSubmit({
      ...form,
      duration: Number(form.duration),
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-[6px] px-4 py-2 bg-[#3fdcbf] text-white ">
          Add Session History
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg rounded-2xl p-6 space-y-4 bg-[#EBF4F2] text-gray-800 border-none">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Add Session History
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Session Date</label>
            <Input
              type="datetime-local"
              name="sessionDate"
              value={form.sessionDate}
              onChange={handleChange}
              className="bg-white text-gray-800 border-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Notes</label>
            <Textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              className="bg-white text-gray-800 border-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Duration (minutes)</label>
            <Input
              type="number"
              name="duration"
              value={form.duration}
              onChange={handleChange}
              className="bg-white text-gray-800 border-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Session Type</label>
            <select
              name="sessionType"
              value={form.sessionType}
              onChange={(e) =>
                setForm({ ...form, sessionType: e.target.value })
              }
              className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#346778] focus:outline-none"
            >
              <option value="Individual Therapy">Individual Therapy</option>
              <option value="Group Therapy">Group Therapy</option>
              <option value="Crisis Intervention">Crisis Intervention</option>
              <option value="Family Therapy">Family Therapy</option>
              <option value="Couples Therapy">Couples Therapy</option>
            </select>
          </div>

          <Button
            className="rounded-[6px] px-4 py-2 bg-[#3fdcbf] text-white w-full"
            onClick={handleSubmit}
          >
            Save Session History
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
