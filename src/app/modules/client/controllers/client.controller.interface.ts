import { DeleteClientResDto } from '@app/modules/client/dtos/response/delete-client-res.dto';
import { GetClietUuidReqDto } from '@app/modules/client/dtos/request/get-client-uuid-req.dto';
import { GetClientResDto } from '@app/modules/client/dtos/response/get-client-res.dto';
import { GetSingleClientResDto } from '@app/modules/client//dtos/response/get-single-client-res.dto';
import { PostClientReqDto } from '@app/modules/client/dtos/request/post-client-req.dto';
import { PutClientReqDto } from '@app/modules/client/dtos/request/put-client.req.dto';

export interface ClientControllerInterface {
    getRDP(
        req: Request,
        startDate?: string,
        endDate?: string,
        emotion?: string,
        pacientId?: number,
    ): Promise<GetClientResDto>;
    postRDP(req: Request, body: PostClientReqDto): Promise<GetSingleClientResDto>;
    putRDP(req: Request, param: GetClietUuidReqDto, body: PutClientReqDto): Promise<GetSingleClientResDto>;
    deleteRPD(req: Request, param: string ): Promise<DeleteClientResDto>;
}