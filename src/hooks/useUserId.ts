import { useAppSelector } from "./useRedux";


export const useUserId = (): string | undefined => {
    const user = useAppSelector((state) => state.auth.user);
    console.log(user);
    return user?.id;
};
