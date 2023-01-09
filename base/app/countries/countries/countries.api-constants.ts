import { CountriesBase} from '@baseapp/countries/countries/countries.base.model';

export class CountriesApiConstants {
    public static readonly update: any = {
        url: '/rest/countries/',
        method: 'PUT',
        showloading: true
    };
    public static readonly getById: any = {
        url: '/rest/countries/{sid}',
        method: 'GET',
        showloading: true
    };
    public static readonly create: any = {
        url: '/rest/countries/',
        method: 'POST',
        showloading: true
    };
    public static readonly delete: any = {
        url: '/rest/countries/{ids}',
        method: 'DELETE',
        showloading: true
    };
    public static readonly getDatatableData: any = {
        url: '/rest/countries/datatable',
        method: 'POST',
        showloading: true
    };
    public static readonly autoSuggestService: any = {
        url: '/rest/countries/autosuggest',
        method: 'GET',
        showloading: false
    };
}