import { DeleteClientResDto } from '@app/modules/client//dtos/response/delete-client-res.dto';
import { GetClientResDto } from '@app/modules/client//dtos/response/get-client-res.dto';
import { GetSingleClientResDto } from '@app/modules/client//dtos/response/get-single-client-res.dto';
import { PostClientReqDto } from '@app/modules/client/dtos/request/post-client-req.dto';
import { PutClientReqDto } from '@app/modules/client/dtos/request/put-client.req.dto';

export interface ClientServiceInterface {
    getRDP(
        userUuid: string, 
        startDate?: string, 
        endDate?: string, 
        emotion?: string, 
        pacientId?: number
    ): Promise<GetClientResDto>;
    postRDP(userUuid: string, body: PostClientReqDto): Promise<GetSingleClientResDto>
    putRDP(userUuid: string, body: PutClientReqDto): Promise<GetSingleClientResDto>
    deleteRPD(RdpUuid: string, userUuid: string): Promise<DeleteClientResDto>
}