import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ProcessedIngredient {
    name: string;
    isHarmful: boolean;
}
export interface FoodAnalysisResult {
    status: HealthStatus;
    sugarLevel: Level;
    calories: bigint;
    healthScore: bigint;
    fatLevel: Level;
    foodName: string;
}
export interface IngredientScanResult {
    processedIngredients: Array<ProcessedIngredient>;
    harmfulCount: bigint;
}
export interface UserProfile {
    age: bigint;
    weight: bigint;
    healthConditions: Array<HealthCondition>;
}
export enum HealthCondition {
    highCholesterol = "highCholesterol",
    none = "none",
    highBloodPressure = "highBloodPressure",
    obesity = "obesity",
    heartDisease = "heartDisease",
    diabetes = "diabetes"
}
export enum HealthStatus {
    safe = "safe",
    harmful = "harmful",
    moderate = "moderate"
}
export enum Level {
    Low = "Low",
    High = "High",
    Medium = "Medium"
}
export interface backendInterface {
    analyzeFood(foodName: string): Promise<FoodAnalysisResult | null>;
    getAllFoods(): Promise<Array<FoodAnalysisResult>>;
    getFoodStats(foodName: string): Promise<{
        sugarLevel: Level;
        calories: bigint;
        healthScore: bigint;
        fatLevel: Level;
    } | null>;
    getHealthWarnings(foodName: string): Promise<{
        status: string;
        warnings: Array<string>;
    }>;
    getUserHealthConditions(): Promise<Array<HealthCondition>>;
    getUserHealthStats(): Promise<{
        age: bigint;
        weight: bigint;
    } | null>;
    getUserProfile(): Promise<UserProfile | null>;
    saveUserProfile(profile: UserProfile): Promise<void>;
    scanIngredients(ingredients: Array<string>): Promise<IngredientScanResult>;
}
