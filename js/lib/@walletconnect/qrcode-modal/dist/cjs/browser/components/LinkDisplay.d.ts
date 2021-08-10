import { IQRCodeModalOptions } from "@walletconnect/types";
import { TextMap } from "../types";
interface LinkDisplayProps {
    mobile: boolean;
    text: TextMap;
    uri: string;
    qrcodeModalOptions?: IQRCodeModalOptions;
}
declare function LinkDisplay(props: LinkDisplayProps): JSX.Element;
export default LinkDisplay;
//# sourceMappingURL=LinkDisplay.d.ts.map