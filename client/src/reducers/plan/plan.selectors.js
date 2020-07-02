import { createSelector } from 'reselect';
const selectPlan = state => state.plans;

export const selectPlans = createSelector(
    [selectPlan],
    plans => plans
)