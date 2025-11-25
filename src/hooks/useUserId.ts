import { useAppSelector } from "./useRedux";


export const useUserId = (): string | undefined => {
    const user = useAppSelector((state) => state.auth.user);
    return user?.user?.id;
};
