export class BaseAppConstants {
	public static isMobile = window.matchMedia('only screen and (max-width: 760px)').matches;
	
	public static dateFormat = 'dd-MMM-yyyy';
	public static dateTimeFormat = 'dd-MMM-yyyy hh:mm';
	public static defaultLocale = 'en-US';
	public static defaultCurrency = 'EUR';
	public static defaultPageSize = 50;
	public static attachmentBaseURL = 'rest/attachments/download/attachment/';
	public static enableReadOnly = false;
	public static localFilePath = '/assets/images/';
	public static showScrollSpy = false;
	public static showBreadcrumb = false;
	public static selectFirstMenuByDefault = false;
}
