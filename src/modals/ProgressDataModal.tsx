// components/treatment-progress-modal.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAddTreatmentProgressMutation } from "@/store/api/ClientsApi";
import { useAddClinicClientTreatmentProgressMutation } from "@/store/api/ClinicClientsApi";
import { useAppSelector } from "@/hooks/useRedux";
import { useUserId } from "@/hooks/useUserId";
import { toast } from "sonner";

// Types
interface Goal {
  goalName: string;
  score: number;
  isEditing?: boolean;
}

interface TreatmentProgressModalProps {
  clientId: string | undefined;
  trigger?: React.ReactNode;
}

// Predefined goal options
const PREDEFINED_GOALS = [
  "Anxiety Level",
  "Sleep Quality",
  "Mood Stability",
  "Stress Management",
  "Social Interaction",
  "Self-Care",
  "Medication Adherence",
  "Therapy Engagement",
];

export function TreatmentProgressModal({
  clientId,
  trigger,
}: TreatmentProgressModalProps) {
  const userType = useAppSelector((state) => state.auth.userType);
  const userId = useUserId();
  const [open, setOpen] = useState(false);
  const [, setIsSubmitting] = useState(false);
  const [progressDate, setProgressDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [goals, setGoals] = useState<Goal[]>([
    { goalName: "Anxiety Level", score: 7, isEditing: false },
    { goalName: "Sleep Quality", score: 8, isEditing: false },
  ]);
  const [notes, setNotes] = useState("");
  const [addedTreatmentProgress, { isLoading: clientloading }] =
    useAddTreatmentProgressMutation();
  const [addedClinicClientTreatmentProgress, { isLoading: isLoading2 }] =
    useAddClinicClientTreatmentProgressMutation();
  const isLoading = clientloading || isLoading2;
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setGoals(goals.map((goal) => ({ ...goal, isEditing: false })));

    // Convert date string to ISO string
    const dateObj = new Date(progressDate);

    // Prepare payload exactly as in your cURL request
    const payload = {
      progressDate: dateObj.toISOString(),
      goals: goals
        .filter((goal) => goal.goalName.trim() !== "")
        .map(({ goalName, score }) => ({ goalName, score })),
      notes: notes.trim(),
    };
    try {
      if (userType === "THERAPIST" || userType === "INDIVIDUAL_THERAPIST") {
        await addedTreatmentProgress({
          therapistId: userId,
          clientId: clientId || "",
          credentials: payload,
        });
      } else if (userType === "CLINIC") {
        await addedClinicClientTreatmentProgress({
          clinicId: userId,
          clientId: clientId || "",
          progressData: payload,
        });
      }
      toast.success("Progress Note saved successfully!");
      setOpen(false);
    } catch (error) {
      console.error("error:", error);
      toast.error("Failed to save progress note. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add new goal
  const addGoal = () => {
    setGoals([...goals, { goalName: "", score: 7, isEditing: true }]);
  };

  const removeGoal = (index: number) => {
    if (goals.length > 1) {
      const newGoals = [...goals];
      newGoals.splice(index, 1);
      setGoals(newGoals);
    }
  };

  // Update goal score
  const updateGoalScore = (index: number, score: number) => {
    const newGoals = [...goals];
    newGoals[index] = { ...newGoals[index], score };
    setGoals(newGoals);
  };

  // Update goal name
  const updateGoalName = (index: number, goalName: string) => {
    const newGoals = [...goals];
    newGoals[index] = { ...newGoals[index], goalName };
    setGoals(newGoals);
  };

  // Toggle edit mode for a goal
  const toggleEditGoal = (index: number) => {
    const newGoals = [...goals];
    newGoals[index] = {
      ...newGoals[index],
      isEditing: !newGoals[index].isEditing,
    };
    setGoals(newGoals);

    // Focus the input field when entering edit mode
    if (!newGoals[index].isEditing) {
      setTimeout(() => {
        inputRefs.current[index]?.focus();
      }, 10);
    }
  };

  // Save edit for a goal
  const saveGoalEdit = (index: number) => {
    const newGoals = [...goals];
    newGoals[index] = {
      ...newGoals[index],
      isEditing: false,
    };
    setGoals(newGoals);
  };

  // Cancel edit for a goal
  const cancelGoalEdit = (index: number) => {
    const newGoals = [...goals];
    newGoals[index] = {
      ...newGoals[index],
      isEditing: false,
    };
    setGoals(newGoals);
  };

  // Add predefined goal
  const addPredefinedGoal = (goalName: string) => {
    setGoals([...goals, { goalName, score: 7, isEditing: false }]);
  };

  // Handle key press in goal name input
  const handleGoalNameKeyPress = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveGoalEdit(index);
    } else if (e.key === "Escape") {
      cancelGoalEdit(index);
    }
  };

  // Focus input when editing starts
  useEffect(() => {
    goals.forEach((goal, index) => {
      if (goal.isEditing && inputRefs.current[index]) {
        inputRefs.current[index]?.focus();
      }
    });
  }, [goals]);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      // Reset form to initial state
      setProgressDate(new Date().toISOString().split("T")[0]);
      setGoals([
        { goalName: "Anxiety Level", score: 7, isEditing: false },
        { goalName: "Sleep Quality", score: 8, isEditing: false },
      ]);
      setNotes("");
      setIsSubmitting(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="  bg-[#3FDCBF1A]  text-[#3FDCBF] font-semibold rounded-xl px-8 py-6  transition-all transform  border border-[#3FDCBF] cursor-pointer">
            Add Treatment Progress
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] border-none max-h-[80vh] overflow-y-auto bg-[#EBF4F2]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-[#32363F] font-medium">
              Add Treatment Progress
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* Progress Date - Using HTML5 date input */}
            <div className="grid gap-2 text-[#32363F]">
              <Label htmlFor="progressDate">Progress Date *</Label>
              <Input
                id="progressDate"
                type="date"
                value={progressDate}
                onChange={(e) => setProgressDate(e.target.value)}
                required
                className="w-full bg-[#FAFAF7] border-[#EAE9DD]"
              />
            </div>

            {/* Goals Section */}
            <div className="grid gap-4 text-[#32363F]">
              <div className="flex items-center justify-between">
                <Label>Goals *</Label>
                <Button
                  type="button"
                  variant="default"
                  className="bg-[#3FDCBF] text-white"
                  size="sm"
                  onClick={addGoal}
                >
                  <Plus className="h-4 w-4 " />
                  Add Goal
                </Button>
              </div>

              {goals.map((goal, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 bg-[#FAFAF7] border-[#EAE9DD] rounded-lg"
                >
                  <div className="grid gap-2 flex-1">
                    <Label htmlFor={`goal-${index}`}>Goal Name</Label>

                    {goal.isEditing ? (
                      <div className="flex items-center gap-2 ">
                        <Input
                          ref={(el) => {
                            inputRefs.current[index] = el;
                          }}
                          placeholder="Enter goal name"
                          value={goal.goalName}
                          onChange={(e) =>
                            updateGoalName(index, e.target.value)
                          }
                          onKeyDown={(e) => handleGoalNameKeyPress(index, e)}
                          className="flex-1 bg-[#FAFAF7] border-[#EAE9DD]"
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() => saveGoalEdit(index)}
                          disabled={!goal.goalName.trim()}
                        >
                          <Check className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() => cancelGoalEdit(index)}
                        >
                          <X className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-2 border rounded bg-muted/50 bg-[#FAFAF7] border-[#EAE9DD]">
                        <span className="font-medium ">
                          {goal.goalName || "Unnamed Goal"}
                        </span>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() => toggleEditGoal(index)}
                          className="h-6 w-6"
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="grid gap-2 w-32">
                    <Label htmlFor={`score-${index}`}>Score (0-10)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id={`score-${index}`}
                        type="number"
                        min="0"
                        max="10"
                        value={goal.score}
                        onChange={(e) =>
                          updateGoalScore(index, parseInt(e.target.value) || 0)
                        }
                        className="w-20 bg-[#FAFAF7] border-[#EAE9DD]"
                      />
                      <span className="text-sm text-muted-foreground">/10</span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeGoal(index)}
                    disabled={goals.length === 1}
                    className="mt-6"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {/* Quick Add Common Goals */}
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Quick add common goals:
                </p>
                <div className="flex flex-wrap gap-2">
                  {PREDEFINED_GOALS.map((goalName) => (
                    <Button
                      key={goalName}
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => addPredefinedGoal(goalName)}
                      className="text-xs"
                    >
                      {goalName}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes *</Label>
              <Textarea
                id="notes"
                placeholder="Enter progress notes, observations, or comments..."
                className="bg-[#FAFAF7] border-[#EAE9DD]"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                required
              />
            </div>
          </div>

          <DialogFooter className="flex justify-between ">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              className="bg-website-primary-color text-white flex-1"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  Submitting...
                </>
              ) : (
                "Submit Progress"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
