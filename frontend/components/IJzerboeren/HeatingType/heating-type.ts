export enum HeatingType {
    HEAT_PUMP = "HEAT_PUMP",
    GAS_BURNER = "GAS_BURNER",
    /**
     * District heating using waste heat.
     */
    DISTRICT_HEATING = "DISTRICT_HEATING",
    /**
     * District heating using iron powder as a heat source.
     * This option is for step 3 only.
     */
    IRON_POWDER = "IRON_POWDER",
}
