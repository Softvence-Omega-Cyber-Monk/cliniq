import baseApi from "./BaseApi/BaseApi";

export const reportsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getUpcomingAppointment: builder.query({
            query: (params) => ({
                url: "/appointments/upcoming",
                method: "GET",
                params: {
                    days: params.days,
                    limit: params.limit,
                }
            })
        }),
        createAppointment: builder.mutation({
            query: (appointment) => ({
                url: "/appointments",
                method: "POST",
                body: appointment
            })
        })

    }),
});

export const {
    useGetUpcomingAppointmentQuery
} = reportsApi;
