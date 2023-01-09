import { BaseAppConstants } from "@baseapp/app-constants.base";
import { AppHomeBaseService } from "./app-home.service.base";
import { AppUtilBaseService } from "../app-util.base.service";

export class AppHomePageBaseComponent {

    tiles: any;
    tilesPerRow: any = 4
    isMobile: boolean = BaseAppConstants.isMobile;
    tileWidth: any = "20%"
    constructor(public bs: AppHomeBaseService, public utilBase: AppUtilBaseService) { }
    onInit(): void {
        this.tiles = this.bs.getLandingPageData()
        let tiles = this.tiles.data?.properties?.numberOfTilesPerRow
        this.tilesPerRow = tiles
        if (tiles == 3) {
            this.tileWidth = "30%"
        } else if (tiles == 4) {
            this.tileWidth = "20%"
        } else if (tiles == 5) {
            this.tileWidth = "15%"
        } else if (tiles > 5) {
            this.tilesPerRow = 5
            this.tileWidth = "10%"
        } else {
            this.tilesPerRow = 5
        }
    }

    getImageUrl(tile: any) {
        if (tile.data.properties?.image.icon) {
            return "assets/images/" + tile.data.properties?.image?.icon[0]?.fileName
        } else {
            return ""
        }
    }

    getStyles() {
        let value: any
        if (this.tiles.data?.properties?.backgroundImage?.type == 'uploaded') {
            value = "url(assets/images/" + this.tiles.data?.properties?.backgroundImage?.icon[0].fileName + ")"
        } else {
            value = this.tiles.data?.properties?.backgroundColor
        }
        let styleObj: any = {
            "background": value
        };
        return styleObj;
    }
}
