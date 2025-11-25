import baseApi from "./BaseApi/BaseApi";

export const reportsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        createAppointment: builder.mutation({
            query: ({ therapistId, appointment }) => ({
                url: `/therapists/${therapistId}/clients`,
                method: "POST",
                body: appointment,
            })

        })

    }),
});

export const {
    useCreateAppointmentMutation
} = reportsApi;
