import { StaticImage } from "@/components/ImageSelector/types"

export type FeedbackModal = {
    id: string
    type: string
    value: {
        modaltitle: string
        modaltext: string
        modaltheme: string
        imageSelector: {
            id: string
            title: string
            img: StaticImage
        }
        conditions: Condition[]
    }
}

export enum ConditionType {
    datamodel_query_condition = "datamodel_query_condition",
    interactive_input_condition = "interactive_input_condition",
    kpi_condition = "kpi_condition",
    anylogic_output_condition = "anylogic_output_condition",
}

type Condition =
    | DatamodelQueryCondition
    | InteractiveInputCondition
    | KPICondition
    | AnyLogicOutputCondition

export type KPICondition = {
    id: string
    type: ConditionType.kpi_condition
    value: {
        parameter: string // kpi in format "level|value"
        operator: string
        value: string
    }
}

export type InteractiveInputCondition = {
    id: string
    type: ConditionType.interactive_input_condition
    value: {
        parameter: string // interactive input id
        operator: string
        value: string
    }
}

export type AnyLogicOutputCondition = {
    id: string
    type: ConditionType.anylogic_output_condition
    value: {
        anylogicOutputKey: string
        operator: string
        value: string
    }
}

export type DatamodelQueryCondition = {
    id: string
    type: ConditionType.datamodel_query_condition
    value: {
        datamodelQueryRule: number // id of datamodel query rule
        operator: string
        value: string
    }
}
