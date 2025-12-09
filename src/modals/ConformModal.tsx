import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Props {
  children?: React.ReactNode;
  onConfirm?: () => void;
  triggerText?: string;
  triggerBtnStyle?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "outline" | "destructive" | "default" | "secondary" | "warning";
  icon?: "delete" | "warning" | "ban" | "archive" | "power" | "alert";
  disabled?: boolean;
}

export function ConfirmationModal({
  children,
  onConfirm,
  triggerBtnStyle = "bg-[#D45B53]",
  triggerText = "Confirm",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",

  disabled = false,
}: Props) {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  // Determine button variant based on action type
  const confirmButtonVariant =
    variant === "destructive" ? "destructive" : "default";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className={`${triggerBtnStyle} cursor-pointer`}
          size="default"
          disabled={disabled}
        >
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-[#FAFAF7] border-none">
        <div className="space-y-4">{children}</div>

        <DialogFooter className="sm:justify-end space-x-2 mt-6">
          <DialogClose asChild>
            <Button className="cursor-pointer" type="button" variant="outline">
              {cancelText}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              className="bg-[#D45B53] text-white cursor-pointer"
              type="button"
              variant={confirmButtonVariant}
              onClick={handleConfirm}
            >
              {confirmText}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Usage examples:

/*
// For delete
<ConfirmationModal
  onConfirm={() => deleteUser(user.id)}
  triggerText="Delete"
  confirmText="Delete"
  variant="destructive"
  icon="delete"
>
  <div className="flex items-start space-x-3">
    <div className="p-2 bg-red-100 rounded-full">
      <Trash2 className="w-5 h-5 text-red-600" />
    </div>
    <div>
      <h3 className="text-lg font-semibold">Delete User</h3>
      <p className="text-gray-600 mt-1">Are you sure you want to delete this user? This action cannot be undone.</p>
    </div>
  </div>
</ConfirmationModal>

// For suspend
<ConfirmationModal
  onConfirm={() => suspendUser(user.id)}
  triggerText="Suspend"
  confirmText="Suspend"
  variant="warning"
  icon="ban"
>
  <div className="flex items-start space-x-3">
    <div className="p-2 bg-yellow-100 rounded-full">
      <Ban className="w-5 h-5 text-yellow-600" />
    </div>
    <div>
      <h3 className="text-lg font-semibold">Suspend User</h3>
      <p className="text-gray-600 mt-1">This user will not be able to access their account until you unsuspend them.</p>
    </div>
  </div>
</ConfirmationModal>

// For archive
<ConfirmationModal
  onConfirm={() => archiveProject(project.id)}
  triggerText="Archive"
  confirmText="Archive"
  variant="secondary"
  icon="archive"
>
  <div className="flex items-start space-x-3">
    <div className="p-2 bg-blue-100 rounded-full">
      <Archive className="w-5 h-5 text-blue-600" />
    </div>
    <div>
      <h3 className="text-lg font-semibold">Archive Project</h3>
      <p className="text-gray-600 mt-1">This project will be moved to archives and hidden from active projects.</p>
    </div>
  </div>
</ConfirmationModal>

// For activate/deactivate
<ConfirmationModal
  onConfirm={() => toggleUserStatus(user.id)}
  triggerText={user.isActive ? "Deactivate" : "Activate"}
  confirmText={user.isActive ? "Deactivate" : "Activate"}
  variant={user.isActive ? "warning" : "default"}
  icon="power"
>
  <div className="flex items-start space-x-3">
    <div className="p-2 bg-gray-100 rounded-full">
      <Power className="w-5 h-5 text-gray-600" />
    </div>
    <div>
      <h3 className="text-lg font-semibold">
        {user.isActive ? "Deactivate User" : "Activate User"}
      </h3>
      <p className="text-gray-600 mt-1">
        {user.isActive 
          ? "This user will lose access to their account until reactivated." 
          : "This user will regain access to their account."}
      </p>
    </div>
  </div>
</ConfirmationModal>
*/
