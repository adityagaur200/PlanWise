package com.backend.backend.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class IceCandidate
{
    private String candidate;
    private String sdpMid;
    private Integer sdpMLineIndex;


    public String getCandidate() {
        return candidate;
    }
    public void setCandidate(String candidate) {
        this.candidate = candidate;
    }
    public String getSdpMid() {
        return sdpMid;
    }
    public void setSdpMid(String sdpMid) {
            this.sdpMid = sdpMid;
    }
    public Integer getSdpMLineIndex() {
        return sdpMLineIndex;
    }
    public void setSdpMLineIndex(Integer sdpMLineIndex) {
        this.sdpMLineIndex = sdpMLineIndex;
    }

}


