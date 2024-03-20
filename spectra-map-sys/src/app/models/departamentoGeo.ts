export interface Feature {
    type: string;
    id: string;
    properties: {
        Codigo: string;
        Nombre: string;
        Nomenclatura: string;
    };
    geometry_name: string;
    geometry: {
        type: string;
        coordinates: number[][][][];
    };
}

export interface FeatureCollection {
    type: string;
    name: string;
    features: Feature[];
}