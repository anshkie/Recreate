import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const EditControls = ({ onEdit }) => {
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(10);
  const [mute, setMute] = useState(false);
  const [overlayText, setOverlayText] = useState('');
  const [generateThumbnail, setGenerateThumbnail] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEdit = async () => {
    setLoading(true);
    try {
      await onEdit({ startTime, endTime, mute, overlayText, generateThumbnail });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="space-y-4 p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startTime">Trim Start (s)</Label>
            <Input
              id="startTime"
              type="number"
              value={startTime}
              onChange={(e) => setStartTime(Number(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="endTime">Trim End (s)</Label>
            <Input
              id="endTime"
              type="number"
              value={endTime}
              onChange={(e) => setEndTime(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="mute"
            checked={mute}
            onCheckedChange={(checked) => setMute(checked)}
          />
          <Label htmlFor="mute">Mute Audio</Label>
        </div>

        <div>
          <Label htmlFor="overlayText">Overlay Text</Label>
          <Input
            id="overlayText"
            type="text"
            value={overlayText}
            onChange={(e) => setOverlayText(e.target.value)}
            placeholder="Enter overlay text"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="thumbnail"
            checked={generateThumbnail}
            onCheckedChange={(checked) => setGenerateThumbnail(checked)}
          />
          <Label htmlFor="thumbnail">Generate Thumbnail</Label>
        </div>

        <Button onClick={handleEdit} className="w-full" disabled={loading}>
          {loading ? "Applying..." : "Apply Edits"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EditControls;
